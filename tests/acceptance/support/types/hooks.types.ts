import type { ChildProcessWithoutNullStreams } from "node:child_process";

type AcceptanceHooksProcesses = {
  app?: ChildProcessWithoutNullStreams;
};

export type { AcceptanceHooksProcesses };