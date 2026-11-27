import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";

import configArray from "../eslint.config";

import type { Linter } from "eslint";

const BRIDGE_CONFIG_NAME_PREFIX = "oxlint/";
const CONFIG_PATH = path.resolve(import.meta.dirname, "../oxlint.config.jsonc");
const WARN_SEVERITY = 1;
const ERROR_SEVERITY = 2;
const ENABLED_SEVERITIES: Set<unknown> = new Set(["error", "warn", "deny", WARN_SEVERITY, ERROR_SEVERITY]);
const ESLINT_CORE_RULE_PREFIX = "eslint/";
const ESLINT_PLUGIN_PREFIX_ALIASES: Record<string, string> = {
  "@typescript-eslint/": "typescript/",
  "import-x/": "import/",
};
const EXCLUDED_PLUGINS = new Set(["jest", "jsdoc", "jsx_a11y", "nextjs", "react", "react_perf", "vue"]);
const EXIT_CODE_FINDINGS = 1;
const EXIT_CODE_ERROR = 2;

type OxlintRuleEntry = {
  scope: string;
  value: string;
  docs_url: string;
};

type OxlintConfig = {
  rules?: Record<string, unknown>;
  overrides?: { rules?: Record<string, unknown> }[];
};

type OptionDrift = {
  ruleName: string;
  eslintEntry: unknown;
  oxlintEntry: unknown;
};

type OptionParityReport = {
  comparedCount: number;
  drift: OptionDrift[];
};

class ScriptError extends Error {
  public override readonly name = "ScriptError";

  public readonly exitCode: number;

  public constructor(message: string, exitCode: number) {
    super(message);
    this.exitCode = exitCode;
  }
}

function getOxlintVersion(): string {
  try {
    const raw: string = execSync("pnpm exec oxlint --version", { encoding: "utf8" }).trim();

    return raw.replace(/^version:\s*/iu, "");
  } catch {
    return "unknown";
  }
}

function isOxlintRuleEntryArray(data: unknown): data is OxlintRuleEntry[] {
  return Array.isArray(data) && data.every((entry: unknown) => typeof entry === "object" && entry !== null && "scope" in entry && "value" in entry && "docs_url" in entry);
}

function fetchAvailableRules(): Map<string, string> {
  const output: string = execSync("pnpm exec oxlint --rules --format json", { encoding: "utf8" });

  if (!output.trim()) {
    throw new ScriptError("'oxlint --rules --format json' returned empty output.", EXIT_CODE_ERROR);
  }

  const parsed: unknown = JSON.parse(output);

  if (!isOxlintRuleEntryArray(parsed)) {
    throw new ScriptError("Unexpected JSON structure from 'oxlint --rules --format json'.", EXIT_CODE_ERROR);
  }

  const rules: Map<string, string> = new Map();

  for (const { scope, value, docs_url: docsUrl } of parsed) {
    if (!EXCLUDED_PLUGINS.has(scope)) {
      rules.set(`${scope}/${value}`, docsUrl);
    }
  }

  if (rules.size === 0) {
    throw new ScriptError("No rules found in 'oxlint --rules --format json' output.", EXIT_CODE_ERROR);
  }
  return rules;
}

function stripJsoncComments(content: string): string {
  return content
    .replaceAll(/^\s*\/\/.*$/gmu, "")
    .replaceAll(/\/\/[^"]*$/gmu, "");
}

function isOxlintConfig(data: unknown): data is OxlintConfig {
  return typeof data === "object" && data !== null;
}

function parseConfig(): OxlintConfig {
  const content: string = readFileSync(CONFIG_PATH, "utf8");
  const parsed: unknown = JSON.parse(stripJsoncComments(content));

  if (!isOxlintConfig(parsed)) {
    throw new ScriptError("Unexpected config structure in oxlint.config.jsonc.", EXIT_CODE_ERROR);
  }
  return parsed;
}

function collectConfiguredRules(config: OxlintConfig): Set<string> {
  const configured: Set<string> = new Set();

  const collectFromObject = (rulesObject: Record<string, unknown>): void => {
    for (const key of Object.keys(rulesObject)) {
      const slashIndex = key.indexOf("/");

      if (slashIndex !== -1) {
        const plugin = key.slice(0, slashIndex);
        const ruleName = key.slice(slashIndex + 1);

        if (!EXCLUDED_PLUGINS.has(plugin)) {
          configured.add(`${plugin}/${ruleName}`);
        }
      }
    }
  };

  if (config.rules) {
    collectFromObject(config.rules);
  }

  if (config.overrides) {
    for (const override of config.overrides) {
      if (override.rules) {
        collectFromObject(override.rules);
      }
    }
  }
  return configured;
}

function computeMissingRules(available: Map<string, string>, configured: Set<string>): Map<string, string> {
  const missing: Map<string, string> = new Map();

  for (const [fullName, docsUrl] of available) {
    if (!configured.has(fullName)) {
      missing.set(fullName, docsUrl);
    }
  }
  return missing;
}

function groupByPlugin(rules: Map<string, string>): Map<string, { name: string; docsUrl: string }[]> {
  const grouped: Map<string, { name: string; docsUrl: string }[]> = new Map();

  for (const [fullName, docsUrl] of rules) {
    const slashIndex = fullName.indexOf("/");
    const plugin = fullName.slice(0, slashIndex);
    const name = fullName.slice(slashIndex + 1);
    const existing = grouped.get(plugin) ?? [];

    existing.push({ name, docsUrl });
    grouped.set(plugin, existing);
  }
  return grouped;
}

function normalizeEslintRuleName(ruleName: string): string {
  const alias = Object.entries(ESLINT_PLUGIN_PREFIX_ALIASES).find(([prefix]) => ruleName.startsWith(prefix));

  if (alias !== undefined) {
    return `${alias[1]}${ruleName.slice(alias[0].length)}`;
  }
  return ruleName.includes("/") ? ruleName : `${ESLINT_CORE_RULE_PREFIX}${ruleName}`;
}

function getRuleSeverity(entry: unknown): unknown {
  return Array.isArray(entry) ? entry[0] : entry;
}

function isRuleEnabled(entry: unknown): boolean {
  return ENABLED_SEVERITIES.has(getRuleSeverity(entry));
}

function getRuleOptions(entry: unknown): unknown[] {
  return Array.isArray(entry) ? entry.slice(1) : [];
}

function assertBridgeConfigsPresent(configs: Linter.Config[]): void {
  const hasBridgeConfig = configs.some(config => config.name?.startsWith(BRIDGE_CONFIG_NAME_PREFIX) === true);

  if (!hasBridgeConfig) {
    throw new ScriptError("No eslint-plugin-oxlint bridge config found in eslint.config.ts: cannot compare linter options.", EXIT_CODE_ERROR);
  }
}

function isUnscopedConfig(config: Linter.Config): boolean {
  return config.rules !== undefined && config.files === undefined && config.name?.startsWith(BRIDGE_CONFIG_NAME_PREFIX) !== true;
}

function collectUnscopedEslintRules(configs: Linter.Config[]): Map<string, unknown> {
  const rules: Map<string, unknown> = new Map();

  for (const config of configs) {
    if (isUnscopedConfig(config) && config.rules !== undefined) {
      const configRules: Record<string, unknown> = config.rules;

      for (const [ruleName, entry] of Object.entries(configRules)) {
        rules.set(normalizeEslintRuleName(ruleName), entry);
      }
    }
  }
  return rules;
}

function compareSharedRuleOptions(eslintRules: Map<string, unknown>, oxlintRules: Map<string, unknown>): OptionParityReport {
  const drift: OptionDrift[] = [];
  let comparedCount = 0;

  for (const [ruleName, oxlintEntry] of oxlintRules) {
    const eslintEntry = eslintRules.get(ruleName);

    if (eslintEntry !== undefined && isRuleEnabled(eslintEntry) && isRuleEnabled(oxlintEntry)) {
      comparedCount += 1;
      if (!isDeepStrictEqual(getRuleOptions(eslintEntry), getRuleOptions(oxlintEntry))) {
        drift.push({ ruleName, eslintEntry, oxlintEntry });
      }
    }
  }
  if (comparedCount === 0) {
    throw new ScriptError("No rule is enabled by both linters: the option-parity check would be a no-op.", EXIT_CODE_ERROR);
  }
  return { comparedCount, drift };
}

function printOptionParity(report: OptionParityReport): void {
  console.log(`\u{1F50E} Shared rules compared: ${report.comparedCount} (unscoped ESLint blocks vs top-level oxlint rules; overrides excluded)\n`);

  if (report.drift.length === 0) {
    console.log("\u{2705} No linter option drift on shared rules.");

    return;
  }
  console.log(`\u{26A0}\u{FE0F}  Linter option drift (${report.drift.length}):\n`);
  for (const { ruleName, eslintEntry, oxlintEntry } of report.drift) {
    console.log(`\u{2500}\u{2500} ${ruleName} \u{2500}\u{2500}`);
    console.log(`   ESLint: ${JSON.stringify(eslintEntry)}`);
    console.log(`   Oxlint: ${JSON.stringify(oxlintEntry)}`);
    console.log();
  }
}

function printReport(available: Map<string, string>, configured: Set<string>, missing: Map<string, string>): void {
  const version = getOxlintVersion();

  console.log(`\u{1F4E6} Oxlint version: ${version}`);
  console.log(`\u{1F4CB} Available rules (included plugins): ${available.size}`);
  console.log(`\u{2699}\u{FE0F}  Configured rules: ${configured.size}\n`);

  if (missing.size === 0) {
    console.log("\u{2705} All rules are covered!");

    return;
  }

  console.log(`\u{26A0}\u{FE0F}  Missing rules (${missing.size}):\n`);

  const grouped = groupByPlugin(missing);
  const sortedPlugins = grouped.keys().toArray().toSorted((left, right) => left.localeCompare(right));

  for (const plugin of sortedPlugins) {
    const rules = grouped.get(plugin) ?? [];
    const sortedRules = rules.toSorted((left, right) => left.name.localeCompare(right.name));

    console.log(`\u{2500}\u{2500} ${plugin} (${sortedRules.length}) \u{2500}\u{2500}`);

    for (const rule of sortedRules) {
      console.log(`   ${plugin}/${rule.name} (${rule.docsUrl})`);
    }

    console.log();
  }

  console.log(`\u{1F4CA} Total missing: ${missing.size} rules`);
}

function main(): void {
  console.log("\u{1F50D} Checking oxlint rules coverage...\n");

  const available = fetchAvailableRules();
  const config = parseConfig();
  assertBridgeConfigsPresent(configArray);
  const configured = collectConfiguredRules(config);
  const missing = computeMissingRules(available, configured);
  const parity = compareSharedRuleOptions(collectUnscopedEslintRules(configArray), new Map(Object.entries(config.rules ?? {})));

  printReport(available, configured, missing);
  printOptionParity(parity);

  if (missing.size > 0 || parity.drift.length > 0) {
    throw new ScriptError("Oxlint configuration findings detected.", EXIT_CODE_FINDINGS);
  }
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