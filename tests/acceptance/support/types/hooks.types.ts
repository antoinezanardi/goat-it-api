import type { ChildProcessWithoutNullStreams } from "node:child_process";

type AppLogsFlushResult = {
  stdoutPath: string;
  stderrPath: string;
  stdoutTail: string[];
  stderrTail: string[];
};

type AppLogsManager = {
  flushLogs: (tailLines?: number) => Promise<AppLogsFlushResult>;
  runId: string;
};

type AcceptanceHooksProcesses = {
  app?: ChildProcessWithoutNullStreams;
  appLogs?: AppLogsManager;
};

export type { AcceptanceHooksProcesses, AppLogsManager, AppLogsFlushResult };