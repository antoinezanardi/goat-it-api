import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const RING_BUFFER_DEFAULT_CAPACITY = 10_000;
const DEFAULT_TAIL_LINES = 200;
const LOGS_BASE_DIR = "tests/acceptance/logs";

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

    // Last element might be incomplete, save it for next append
    this.carryBuffer = lines.pop() ?? "";

    // Add complete lines to the ring buffer
    for (const line of lines) {
      if (this.lines.length >= this.capacity) {
        this.lines.shift();
      }
      this.lines.push(line);
    }
  }

  /**
   * Get the last N lines from the buffer.
   */
  public tail(lineCount: number): string[] {
    return this.lines.slice(-lineCount);
  }

  /**
   * Get all lines from the buffer.
   */
  public getAllLines(): string[] {
    return [...this.lines];
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
      // oxlint-disable-next-line no-console
      console.error(`Failed to write log file ${filePath}:`, error);
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
    // oxlint-disable-next-line no-console
    console.error(`Failed to create log directory ${logDirectory}:`, error);
  }
  return logDirectory;
}

/**
 * Print a tail of log lines to stderr with a header.
 */
function printLogTail(streamName: string, filePath: string, lines: string[], tailLength: number): void {
  // oxlint-disable-next-line no-console
  console.error(`\n=== ${streamName} (last ${tailLength} lines) ===`);
  // oxlint-disable-next-line no-console
  console.error(`Full log: ${filePath}`);
  // oxlint-disable-next-line no-console
  console.error(lines.join("\n"));
  // oxlint-disable-next-line no-console
  console.error(`=== End ${streamName} ===\n`);
}

export {
  RingBuffer,
  RING_BUFFER_DEFAULT_CAPACITY,
  DEFAULT_TAIL_LINES,
  LOGS_BASE_DIR,
  generateRunId,
  createLogDirectory,
  printLogTail,
};