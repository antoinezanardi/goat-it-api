import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { parse } from "yaml";

const EXIT_CODE_FINDINGS = 1;
const EXIT_CODE_ERROR = 2;
const WORKFLOWS_DIRECTORY = ".github/workflows";
const ACTIONS_DIRECTORY = ".github/actions";
const EXPRESSION_PATTERN = /\$\{\{/u;

type RunFinding = {
  file: string;
  owner: string;
  step: string;
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

function parseYamlFile(file: string): unknown {
  try {
    return parse(readFileSync(file, "utf8"));
  } catch(error: unknown) {
    throw new ScriptError(`Could not parse ${file}: ${String(error)}`, EXIT_CODE_ERROR);
  }
}

function collectStepFindings(file: string, owner: string, steps: unknown, findings: RunFinding[]): void {
  if (!Array.isArray(steps)) {
    return;
  }

  for (const step of steps) {
    if (isRecord(step) && typeof step.run === "string" && EXPRESSION_PATTERN.test(step.run)) {
      findings.push({
        file,
        owner,
        step: typeof step.name === "string" ? step.name : "<unnamed step>",
      });
    }
  }
}

function collectWorkflowFindings(file: string, document: unknown, findings: RunFinding[]): void {
  if (!isRecord(document) || !isRecord(document.jobs)) {
    return;
  }

  for (const [jobId, job] of Object.entries(document.jobs)) {
    if (isRecord(job)) {
      collectStepFindings(file, `job "${jobId}"`, job.steps, findings);
    }
  }
}

function collectActionFindings(file: string, document: unknown, findings: RunFinding[]): void {
  if (!isRecord(document) || !isRecord(document.runs)) {
    return;
  }

  collectStepFindings(file, "composite action", document.runs.steps, findings);
}

function listWorkflowFiles(): string[] {
  return readdirSync(WORKFLOWS_DIRECTORY)
    .filter(file => file.endsWith(".yml") || file.endsWith(".yaml"))
    .map(file => path.join(WORKFLOWS_DIRECTORY, file));
}

function isActionDefinitionFile(fileName: string): boolean {
  return fileName === "action.yml" || fileName === "action.yaml";
}

function collectActionFilesRecursively(directory: string): string[] {
  const files: string[] = [];
  const entries = readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectActionFilesRecursively(entryPath));
    } else if (isActionDefinitionFile(entry.name)) {
      files.push(entryPath);
    }
  }
  return files;
}

function listActionFiles(): string[] {
  return collectActionFilesRecursively(ACTIONS_DIRECTORY).toSorted((firstFile, secondFile) => firstFile.localeCompare(secondFile));
}

function collectFindings(): RunFinding[] {
  const findings: RunFinding[] = [];

  for (const file of listWorkflowFiles()) {
    collectWorkflowFindings(file, parseYamlFile(file), findings);
  }

  for (const file of listActionFiles()) {
    collectActionFindings(file, parseYamlFile(file), findings);
  }
  return findings;
}

function printFindings(findings: RunFinding[]): void {
  console.error(`\u{274C} ${findings.length} workflow expression(s) found inside a run body:\n`);

  for (const finding of findings) {
    console.error(`  - ${finding.file} \u{2192} ${finding.owner} \u{2192} ${finding.step}`);
  }

  console.error("\nPass expressions through env: and use quoted shell variables instead.");
}

function main(): void {
  console.log("\u{1F50D} Checking workflow run bodies for expressions...\n");

  const findings = collectFindings();

  if (findings.length > 0) {
    printFindings(findings);

    throw new ScriptError("Workflow run body expressions detected.", EXIT_CODE_FINDINGS);
  }

  console.log("\u{2705} No expression found inside a run body.");
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