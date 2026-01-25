import type { RingBuffer } from "@acceptance-support/helpers/logging.helpers";

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
  stdoutBuffer: RingBuffer;
  stderrBuffer: RingBuffer;
};

type AcceptanceHooksProcesses = {
  app?: ChildProcessWithoutNullStreams;
  appLogs?: AppLogsManager;
};

export type { AcceptanceHooksProcesses, AppLogsManager, AppLogsFlushResult };