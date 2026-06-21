import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const CONFIG_PATH = path.resolve(import.meta.dirname, "../configs/oxlint/oxlint.config.jsonc");
const EXCLUDED_PLUGINS = new Set(["jest", "jsdoc", "jsx_a11y", "nextjs", "react", "react_perf", "vue"]);
const EXIT_CODE_MISSING = 1;
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

function printReport(available: Map<string, string>, configured: Set<string>, missing: Map<string, string>): void {
  const version = getOxlintVersion();

  console.log(`\u{1F4E6} Oxlint version: ${version}`);
  console.log(`\u{1F4CB} Available rules (included plugins): ${available.size}`);
  console.log(`\u2699\uFE0F  Configured rules: ${configured.size}\n`);

  if (missing.size === 0) {
    console.log("\u2705 All rules are covered!");

    return;
  }

  console.log(`\u26A0\uFE0F  Missing rules (${missing.size}):\n`);

  const grouped = groupByPlugin(missing);
  const sortedPlugins = [...grouped.keys()].toSorted((left, right) => left.localeCompare(right));

  for (const plugin of sortedPlugins) {
    const rules = grouped.get(plugin) ?? [];
    const sortedRules = rules.toSorted((left, right) => left.name.localeCompare(right.name));

    console.log(`\u2500\u2500 ${plugin} (${sortedRules.length}) \u2500\u2500`);

    for (const rule of sortedRules) {
      console.log(`   ${plugin}/${rule.name} (${rule.docsUrl})`);
    }

    console.log();
  }

  console.log(`\u{1F4CA} Total missing: ${missing.size} rules`);

  throw new ScriptError("Missing rules found.", EXIT_CODE_MISSING);
}

function main(): void {
  console.log("\u{1F50D} Checking oxlint rules coverage...\n");

  const available = fetchAvailableRules();
  const config = parseConfig();
  const configured = collectConfiguredRules(config);
  const missing = computeMissingRules(available, configured);

  printReport(available, configured, missing);
}

try {
  main();
} catch(error: unknown) {
  if (error instanceof ScriptError) {
    console.error(`\u274C ${error.message}`);
    process.exitCode = error.exitCode;
  } else {
    console.error("\u274C Unexpected error:", error);
    process.exitCode = EXIT_CODE_ERROR;
  }
}