import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { DEFAULT_TAIL_LINES, LOGS_BASE_DIR, RING_BUFFER_DEFAULT_CAPACITY } from "@acceptance-support/constants/logging.constants";

import type { ITestCaseHookParameter } from "@cucumber/cucumber";

import type { AppLogsManager } from "@acceptance-support/types/hooks.types";

/**
 * RingBuffer maintains a bounded circular buffer of complete lines.
 * When capacity is exceeded, oldest lines are discarded.
 */
class RingBuffer {
  private readonly lines: string[] = [];

  private readonly capacity: number;

  private carryBuffer = "";

  public constructor(capacity: number = RING_BUFFER_DEFAULT_CAPACITY) {
    this.capacity = capacity;
  }

  /**
   * Append a chunk of text to the buffer.
   * Handles partial lines by maintaining a carry buffer.
   */
  public append(chunk: string): void {
    const text = this.carryBuffer + chunk;
    const lines = text.split("\n");

    this.carryBuffer = lines.pop() ?? "";

    if (lines.length <= 0) {
      return;
    }

    this.lines.push(...lines);
    const overflow = this.lines.length - this.capacity;
    if (overflow > 0) {
      this.lines.splice(0, overflow);
    }
  }

  /**
   * Get the last N lines from the buffer.
   */
  public tail(lineCount: number): string[] {
    return this.lines.slice(-lineCount);
  }

  /**
   * Flush buffer contents to a file.
   * Includes the carry buffer if it contains data.
   */
  public async flushToFile(filePath: string): Promise<void> {
    const allLines = [...this.lines];
    if (this.carryBuffer) {
      allLines.push(this.carryBuffer);
    }
    const content = allLines.join("\n");

    try {
      await writeFile(filePath, content, "utf8");
    } catch(error) {
      console.error(`Failed to write log file ${filePath}:`, error);
      throw error;
    }
  }
}

/**
 * Generate a sanitized timestamp for use in directory names.
 */
function generateRunId(): string {
  const now = new Date();

  return now.toISOString().replaceAll(":", "-").replaceAll(".", "-");
}

/**
 * Create a log directory for the current test run.
 */
async function createLogDirectory(runId: string): Promise<string> {
  const logDirectory = path.join(LOGS_BASE_DIR, `run-${runId}`);

  try {
    await mkdir(logDirectory, { recursive: true });
  } catch(error) {
    console.error(`Failed to create log directory ${logDirectory}:`, error);
  }
  return logDirectory;
}

/**
 * Print a tail of log lines to stderr with a header.
 */
function printLogTail(streamName: string, filePath: string, lines: string[], tailLength: number): void {
  console.error(`\n=== ${streamName} (last ${tailLength} lines, showing ${lines.length}) ===`);
  console.error(`Full log: ${filePath}`);
  console.error(lines.join("\n"));
  console.error(`=== End ${streamName} ===\n`);
}

/**
 * Flush logs and print tails for a failed scenario.
 * Only used in acceptance test hooks.
 * @param appLogs
 * @param scenario
 */
async function flushAndPrintLogTail(appLogs: AppLogsManager, scenario: ITestCaseHookParameter): Promise<void> {
  try {
    const { stdoutPath, stderrPath, stdoutTail, stderrTail } = await appLogs.flushLogs();

    console.error(`\n📋 Acceptance test logs saved for failed scenario: "${scenario.pickle.name}"`);
    console.error(`Run ID: ${appLogs.runId}`);

    printLogTail("STDOUT", stdoutPath, stdoutTail, DEFAULT_TAIL_LINES);
    printLogTail("STDERR", stderrPath, stderrTail, DEFAULT_TAIL_LINES);
  } catch(error) {
    console.error("Failed to flush acceptance logs:", error);
  }
}

export {
  RingBuffer,
  generateRunId,
  createLogDirectory,
  printLogTail,
  flushAndPrintLogTail,
};