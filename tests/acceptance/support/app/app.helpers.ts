import { spawn, spawnSync } from "node:child_process";

import type { SpawnOptions, SpawnOptionsWithoutStdio, ChildProcessWithoutNullStreams } from "node:child_process";

function buildAppForAcceptanceTests(): void {
  const spawnOptions: SpawnOptions = {
    shell: true,
    stdio: "inherit",
  };
  const buildProcess = spawnSync("pnpm run build", spawnOptions);
  if (buildProcess.status !== 0) {
    throw new Error("Failed to build the application for acceptance tests.");
  }
}

function serveAppForAcceptanceTests(): ChildProcessWithoutNullStreams {
  const spawnOptions: SpawnOptionsWithoutStdio = {
    shell: true,
  };
  const serverProcess = spawn("pnpm run start:prod", spawnOptions);

  return serverProcess;
}

function killAppProcess(serverProcess: ChildProcessWithoutNullStreams | undefined): void {
  if (serverProcess?.killed === false) {
    serverProcess.kill("SIGTERM");
    console.log("[acceptance-tests-api] Server process killed.");
  }
}

export {
  buildAppForAcceptanceTests,
  serveAppForAcceptanceTests,
  killAppProcess,
};