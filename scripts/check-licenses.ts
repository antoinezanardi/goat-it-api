import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { isLicenseExpressionAllowed } from "./helpers/license-expression";

const EXIT_CODE_FINDINGS = 1;
const EXIT_CODE_ERROR = 2;
const MAX_SBOM_BUFFER = 67_108_864;
const ALLOWLIST_PATH = fileURLToPath(new URL("../configs/licenses/allowed-licenses.json", import.meta.url));
const PACKAGE_JSON_PATH = fileURLToPath(new URL("../package.json", import.meta.url));

type LicenseException = {
  package: string;
  license: string;
  reason: string;
};

type LicenseAllowlist = {
  allowedLicenses: string[];
  exceptions: LicenseException[];
};

type SbomLicenseEntry = {
  license?: {
    id?: string;
    name?: string;
  };
  expression?: string;
};

type SbomComponent = {
  "name": string;
  "group"?: string;
  "version"?: string;
  "licenses"?: SbomLicenseEntry[];
  "bom-ref"?: string;
  "purl"?: string;
};

type SbomDependency = {
  ref: string;
  dependsOn?: string[];
};

type SbomMetadata = {
  component?: {
    "bom-ref"?: string;
    "purl"?: string;
  };
};

type Sbom = {
  components?: SbomComponent[];
  dependencies?: SbomDependency[];
  metadata?: SbomMetadata;
};

type RootPackage = {
  dependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

type UnknownRecord = Record<string, unknown>;

class ScriptError extends Error {
  public override readonly name = "ScriptError";

  public readonly exitCode: number;

  public constructor(message: string, exitCode: number) {
    super(message);
    this.exitCode = exitCode;
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === "string");
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every(item => typeof item === "string");
}

function isLicenseException(value: unknown): value is LicenseException {
  return isRecord(value) &&
    typeof value.package === "string" &&
    typeof value.license === "string" &&
    typeof value.reason === "string";
}

function isLicenseAllowlist(value: unknown): value is LicenseAllowlist {
  return isRecord(value) &&
    isStringArray(value.allowedLicenses) &&
    Array.isArray(value.exceptions) &&
    value.exceptions.every(isLicenseException);
}

function isSbomComponent(value: unknown): value is SbomComponent {
  return isRecord(value) &&
    typeof value.name === "string" &&
    (value.group === undefined || typeof value.group === "string") &&
    (value.version === undefined || typeof value.version === "string");
}

function isSbomDependency(value: unknown): value is SbomDependency {
  return isRecord(value) &&
    typeof value.ref === "string" &&
    (value.dependsOn === undefined || isStringArray(value.dependsOn));
}

function isSbomMetadata(value: unknown): value is SbomMetadata {
  return isRecord(value) && (value.component === undefined || isRecord(value.component));
}

function isSbom(value: unknown): value is Sbom {
  if (!isRecord(value)) {
    return false;
  }

  const { components, dependencies, metadata } = value;

  return (components === undefined || Array.isArray(components) && components.every(component => isSbomComponent(component))) &&
    (dependencies === undefined || Array.isArray(dependencies) && dependencies.every(dependency => isSbomDependency(dependency))) &&
    (metadata === undefined || isSbomMetadata(metadata));
}

function isRootPackage(value: unknown): value is RootPackage {
  return isRecord(value) &&
    (value.dependencies === undefined || isStringRecord(value.dependencies)) &&
    (value.optionalDependencies === undefined || isStringRecord(value.optionalDependencies));
}

function readFileOrFail(filePath: string, label: string): string {
  try {
    return readFileSync(filePath, "utf8");
  } catch(error: unknown) {
    throw new ScriptError(`Could not read ${label}: ${String(error)}`, EXIT_CODE_ERROR);
  }
}

function parseJsonOrFail(raw: string, label: string): unknown {
  try {
    return JSON.parse(raw);
  } catch(error: unknown) {
    throw new ScriptError(`Could not parse ${label}: ${String(error)}`, EXIT_CODE_ERROR);
  }
}

function readAllowlist(): LicenseAllowlist {
  const parsed = parseJsonOrFail(readFileOrFail(ALLOWLIST_PATH, "the license allowlist"), "the license allowlist");

  if (!isLicenseAllowlist(parsed)) {
    throw new ScriptError("The license allowlist does not match the expected shape.", EXIT_CODE_ERROR);
  }
  return parsed;
}

function readRootPackage(): RootPackage {
  const parsed = parseJsonOrFail(readFileOrFail(PACKAGE_JSON_PATH, "the root package.json"), "the root package.json");

  if (!isRootPackage(parsed)) {
    throw new ScriptError("The root package.json does not match the expected shape.", EXIT_CODE_ERROR);
  }
  return parsed;
}

function runSbom(): string {
  try {
    return execFileSync("pnpm", ["sbom", "--sbom-format", "cyclonedx", "--prod"], {
      encoding: "utf8",
      maxBuffer: MAX_SBOM_BUFFER,
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch(error: unknown) {
    throw new ScriptError(`Could not generate the production SBOM: ${String(error)}`, EXIT_CODE_ERROR);
  }
}

function parseSbom(raw: string): Sbom {
  const parsed = parseJsonOrFail(raw, "the production SBOM");

  if (!isSbom(parsed)) {
    throw new ScriptError("The production SBOM does not match the expected shape.", EXIT_CODE_ERROR);
  }
  return parsed;
}

function getFullName(component: SbomComponent): string {
  return component.group === undefined ? component.name : `${component.group}/${component.name}`;
}

function getComponentReference(component: SbomComponent): string {
  return component["bom-ref"] ?? component.purl ?? `${getFullName(component)}@${component.version ?? "unknown"}`;
}

function indexComponentsByReference(components: SbomComponent[]): Map<string, SbomComponent> {
  const index: Map<string, SbomComponent> = new Map();

  for (const component of components) {
    index.set(getComponentReference(component), component);
  }
  return index;
}

function buildDependencyGraph(dependencies: SbomDependency[]): Map<string, string[]> {
  const graph: Map<string, string[]> = new Map();

  for (const dependency of dependencies) {
    graph.set(dependency.ref, dependency.dependsOn ?? []);
  }
  return graph;
}

function getRootReference(metadata: SbomMetadata | undefined): string {
  const rootReference = metadata?.component?.["bom-ref"] ?? metadata?.component?.purl;

  if (rootReference === undefined) {
    throw new ScriptError("The production SBOM has no root component reference.", EXIT_CODE_ERROR);
  }
  return rootReference;
}

function getStartReferences(rootReference: string, graph: Map<string, string[]>, componentsByReference: Map<string, SbomComponent>, productionDirectNames: Set<string>): string[] {
  const directReferences = graph.get(rootReference) ?? [];
  const startReferences = directReferences.filter(reference => {
    const component = componentsByReference.get(reference);

    return component !== undefined && productionDirectNames.has(getFullName(component));
  });
  const resolvedNames: Set<string> = new Set();

  for (const reference of startReferences) {
    const component = componentsByReference.get(reference);

    if (component !== undefined) {
      resolvedNames.add(getFullName(component));
    }
  }

  const missingNames = productionDirectNames.difference(resolvedNames);

  if (missingNames.size > 0) {
    throw new ScriptError(`Production dependencies missing from the SBOM: ${[...missingNames].join(", ")}.`, EXIT_CODE_ERROR);
  }
  return startReferences;
}

function walkGraph(startReferences: string[], graph: Map<string, string[]>, componentsByReference: Map<string, SbomComponent>): SbomComponent[] {
  const visited: Set<string> = new Set();
  const queue = [...startReferences];
  const components: SbomComponent[] = [];

  while (queue.length > 0) {
    const reference = queue.shift();

    if (reference !== undefined && !visited.has(reference)) {
      visited.add(reference);
      const component = componentsByReference.get(reference);

      if (component !== undefined) {
        components.push(component);
      }

      const nextReferences = graph.get(reference);

      if (nextReferences !== undefined) {
        for (const next of nextReferences) {
          if (!visited.has(next)) {
            queue.push(next);
          }
        }
      }
    }
  }
  return components;
}

function collectProductionClosure(sbom: Sbom, productionDirectNames: Set<string>): SbomComponent[] {
  const componentsByReference = indexComponentsByReference(sbom.components ?? []);
  const graph = buildDependencyGraph(sbom.dependencies ?? []);
  const startReferences = getStartReferences(getRootReference(sbom.metadata), graph, componentsByReference, productionDirectNames);

  return walkGraph(startReferences, graph, componentsByReference);
}

function getLicenseExpressions(component: SbomComponent): string[] {
  return (component.licenses ?? []).map(entry => entry.expression ?? entry.license?.id ?? entry.license?.name ?? "UNKNOWN");
}

function buildLicenseExpression(expressions: string[]): string {
  if (expressions.length === 0) {
    return "UNKNOWN";
  }

  if (expressions.length === 1) {
    return expressions[0];
  }
  return expressions.map(expression => `(${expression})`).join(" AND ");
}

function collectViolations(components: SbomComponent[], allowlist: LicenseAllowlist): string[] {
  const violations: string[] = [];

  for (const component of components) {
    const packageName = getFullName(component);
    const expressions = getLicenseExpressions(component);
    const expression = buildLicenseExpression(expressions);

    if (expressions.length === 0 || !isLicenseExpressionAllowed(expression, packageName, allowlist)) {
      violations.push(`${packageName}@${component.version ?? "unknown"}: ${expression}`);
    }
  }
  return violations;
}

function printViolations(violations: string[]): void {
  console.error(`\u{274C} ${violations.length} production package(s) use a license outside the allowlist:\n`);

  for (const violation of violations) {
    console.error(`  - ${violation}`);
  }

  console.error("\nAdd the license to configs/licenses/allowed-licenses.json, or record a package-scoped exception.");
}

function getProductionDirectNames(rootPackage: RootPackage): Set<string> {
  const names = new Set(Object.keys(rootPackage.dependencies ?? {}));
  const { optionalDependencies } = rootPackage;

  if (optionalDependencies !== undefined) {
    for (const name of Object.keys(optionalDependencies)) {
      names.add(name);
    }
  }
  return names;
}

function main(): void {
  console.log("\u{1F6E1}\u{FE0F}  Checking production dependency licenses...\n");

  const allowlist = readAllowlist();
  const productionDirectNames = getProductionDirectNames(readRootPackage());
  const components = collectProductionClosure(parseSbom(runSbom()), productionDirectNames);

  if (components.length === 0) {
    throw new ScriptError("The production dependency closure contains no component.", EXIT_CODE_ERROR);
  }

  const violations = collectViolations(components, allowlist);

  if (violations.length > 0) {
    printViolations(violations);

    throw new ScriptError("Production license findings detected.", EXIT_CODE_FINDINGS);
  }

  console.log(`\u{2705} ${components.length} production component(s) match the license allowlist.`);
}

try {
  main();
} catch(error: unknown) {
  if (error instanceof ScriptError) {
    console.error(`\u{274C} ${error.message}`);
    process.exitCode = error.exitCode;
  } else {
    console.error("\u{274C} Unexpected error:", error);
    process.exitCode = EXIT_CODE_ERROR;
  }
}