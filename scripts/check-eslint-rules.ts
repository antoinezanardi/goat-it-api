import { execSync } from "node:child_process";

// Acceptable as ESLint only exposes its core rules through the deprecated use-at-your-own-risk entry point
// eslint-disable-next-line import-x/no-deprecated
import { builtinRules } from "eslint/use-at-your-own-risk";

import configArray from "../eslint.config";

import type { Linter } from "eslint";

const EXIT_CODE_FINDINGS = 1;
const EXIT_CODE_ERROR = 2;
const CORE_PLUGIN = "eslint";
const CORE_DOCS_URL_BASE = "https://eslint.org/docs/latest/rules/";

type EslintRuleInfo = {
  fullName: string;
  ruleName: string;
  plugin: string;
  isDeprecated: boolean;
  docsUrl: string | undefined;
};

type MinimalRule = {
  meta?: {
    deprecated?: unknown;
    docs?: {
      url?: string;
    };
  };
};

type PluginWithRules = {
  rules: Record<string, MinimalRule>;
};

class ScriptError extends Error {
  public override readonly name = "ScriptError";

  public readonly exitCode: number;

  public constructor(message: string, exitCode: number) {
    super(message);
    this.exitCode = exitCode;
  }
}

function getEslintVersion(): string {
  try {
    return execSync("pnpm exec eslint --version", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function isPluginWithRules(value: unknown): value is PluginWithRules {
  if (typeof value !== "object" || value === null || !("rules" in value)) {
    return false;
  }

  const rules: unknown = value.rules;

  return typeof rules === "object" && rules !== null;
}

function buildRuleInfo(plugin: string, ruleName: string, rule: MinimalRule): EslintRuleInfo {
  const isCore = plugin === CORE_PLUGIN;

  return {
    fullName: isCore ? ruleName : `${plugin}/${ruleName}`,
    ruleName,
    plugin,
    isDeprecated: Boolean(rule.meta?.deprecated),
    docsUrl: rule.meta?.docs?.url ?? (isCore ? `${CORE_DOCS_URL_BASE}${ruleName}` : undefined),
  };
}

function collectCoreRules(available: Map<string, EslintRuleInfo>): void {
  // Acceptable as ESLint only exposes its core rules through the deprecated builtinRules map
  // oxlint-disable-next-line typescript/no-deprecated
  // eslint-disable-next-line import-x/no-deprecated
  for (const [ruleName, rule] of builtinRules) {
    const info = buildRuleInfo(CORE_PLUGIN, ruleName, rule);

    available.set(info.fullName, info);
  }
}

function collectPluginRules(available: Map<string, EslintRuleInfo>, plugin: string, module: unknown): void {
  if (!isPluginWithRules(module)) {
    return;
  }

  for (const [ruleName, rule] of Object.entries(module.rules)) {
    const info = buildRuleInfo(plugin, ruleName, rule);

    available.set(info.fullName, info);
  }
}

async function collectEveryPluginRule(available: Map<string, EslintRuleInfo>): Promise<void> {
  const typeScriptModule = await import("@typescript-eslint/eslint-plugin");
  const unicornModule = await import("eslint-plugin-unicorn");
  const importModule = await import("eslint-plugin-import-x");
  const stylisticModule = await import("@stylistic/eslint-plugin");
  const vitestModule = await import("@vitest/eslint-plugin");

  collectPluginRules(available, "@typescript-eslint", typeScriptModule.default);
  collectPluginRules(available, "unicorn", unicornModule.default);
  collectPluginRules(available, "import-x", importModule.default);
  collectPluginRules(available, "@stylistic", stylisticModule.default);
  collectPluginRules(available, "vitest", vitestModule.default);
}

async function collectAvailableRules(): Promise<Map<string, EslintRuleInfo>> {
  const available: Map<string, EslintRuleInfo> = new Map();

  collectCoreRules(available);
  await collectEveryPluginRule(available);

  if (available.size === 0) {
    throw new ScriptError("No rules could be loaded from ESLint and its plugins.", EXIT_CODE_ERROR);
  }
  return available;
}

function collectConfiguredRules(configs: Linter.Config[]): Set<string> {
  const configured: Set<string> = new Set();

  for (const config of configs) {
    if (config.rules !== undefined) {
      for (const ruleName of Object.keys(config.rules)) {
        configured.add(ruleName);
      }
    }
  }
  return configured;
}

function collectConfiguredSeverities(configs: Linter.Config[]): Map<string, Linter.RuleSeverity[]> {
  const severities: Map<string, Linter.RuleSeverity[]> = new Map();

  for (const config of configs) {
    if (config.rules !== undefined) {
      for (const [ruleName, entry] of Object.entries(config.rules)) {
        const severity: Linter.RuleSeverity | undefined = Array.isArray(entry) ? entry[0] : entry;
        if (severity !== undefined) {
          const existing = severities.get(ruleName) ?? [];

          existing.push(severity);
          severities.set(ruleName, existing);
        }
      }
    }
  }
  return severities;
}

function isEnabledSeverity(severity: Linter.RuleSeverity): boolean {
  return severity !== "off" && severity !== 0;
}

function filterDeprecatedConfigured(available: Map<string, EslintRuleInfo>, severities: Map<string, Linter.RuleSeverity[]>): EslintRuleInfo[] {
  return available.values().filter(info => info.isDeprecated && (severities.get(info.fullName) ?? []).some(isEnabledSeverity)).toArray();
}

function filterUnsetRules(available: Map<string, EslintRuleInfo>, configured: Set<string>): EslintRuleInfo[] {
  return available.values().filter(info => !info.isDeprecated && !configured.has(info.fullName)).toArray();
}

function groupByPlugin(rules: EslintRuleInfo[]): Map<string, EslintRuleInfo[]> {
  return Map.groupBy(rules, info => info.plugin);
}

function sortByRuleName(rules: EslintRuleInfo[]): EslintRuleInfo[] {
  return [...rules].toSorted((left, right) => left.ruleName.localeCompare(right.ruleName));
}

function printGroupedRules(title: string, rules: EslintRuleInfo[]): void {
  const grouped = groupByPlugin(rules);
  const plugins = grouped.keys().toArray().toSorted((left, right) => left.localeCompare(right));

  console.log(`\n\u{26A0}\u{FE0F}  ${title} (${rules.length}):\n`);

  for (const plugin of plugins) {
    const pluginRules = sortByRuleName(grouped.get(plugin) ?? []);

    console.log(`\u{2500}\u{2500} ${plugin} (${pluginRules.length}) \u{2500}\u{2500}`);

    for (const info of pluginRules) {
      console.log(`   ${info.fullName} (${info.docsUrl ?? "doc unavailable"})`);
    }
    console.log();
  }
}

async function execute(): Promise<void> {
  console.log("\u{1F50D} Checking ESLint rules coverage...\n");

  const available = await collectAvailableRules();
  const configured = collectConfiguredRules(configArray);
  const severities = collectConfiguredSeverities(configArray);
  const deprecatedConfigured = filterDeprecatedConfigured(available, severities);
  const unset = filterUnsetRules(available, configured);

  console.log(`\u{1F4E6} ESLint version: ${getEslintVersion()}`);
  console.log(`\u{1F4CB} Available rules (included plugins): ${available.size}`);
  console.log(`\u{2699}\u{FE0F}  Configured rules: ${configured.size}\n`);

  if (deprecatedConfigured.length === 0 && unset.length === 0) {
    console.log("\u{2705} All rules are covered!");

    return;
  }

  printGroupedRules("Deprecated rules currently enabled", deprecatedConfigured);
  printGroupedRules("Rules not set at all", unset);

  throw new ScriptError("Rule coverage findings detected.", EXIT_CODE_FINDINGS);
}

function reportError(error: unknown): void {
  if (error instanceof ScriptError) {
    console.error(`\u{274C} ${error.message}`);
    process.exitCode = error.exitCode;
  } else {
    console.error("\u{274C} Unexpected error:", error);
    process.exitCode = EXIT_CODE_ERROR;
  }
}

async function main(): Promise<void> {
  try {
    await execute();
  } catch(error: unknown) {
    reportError(error);
  }
}

// Acceptable as this script is transpiled to CommonJS, where top-level await is unavailable
// oxlint-disable-next-line unicorn/prefer-top-level-await
void main();