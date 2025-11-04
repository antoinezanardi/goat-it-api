import { spawn, spawnSync } from "node:child_process";

import { APP_BASE_URL, APP_FORCE_KILL_TIMEOUT_MS, APP_READINESS_TIMEOUT_MS } from "@acceptance-support/constants/app.constants";

import type { ChildProcessWithoutNullStreams, SpawnOptionsWithoutStdio, SpawnOptions } from "node:child_process";

function buildAppForAcceptanceTests(): void {
  const spawnOptions: SpawnOptions = {
    shell: true,
    stdio: "inherit",
  };
  const buildProcess = spawnSync("pnpm run build", spawnOptions);
  if (buildProcess.status !== 0) {
    const errorDetails = buildProcess.error?.message ?? "Unknown error";
    throw new Error(`Failed to build the application for acceptance tests. ${errorDetails}`);
  }
}

async function waitForAppToBeReady(serverProcess: ChildProcessWithoutNullStreams): Promise<ChildProcessWithoutNullStreams> {
  // TODO: Implement a more robust readiness check (e.g., polling the health endpoint)
  return new Promise((resolve) => {
    setTimeout(resolve, APP_READINESS_TIMEOUT_MS, serverProcess);
  });
}

async function serveAppForAcceptanceTests(): Promise<ChildProcessWithoutNullStreams> {
  const spawnOptions: SpawnOptionsWithoutStdio = {
    shell: true,
  };
  const serverProcess = spawn("pnpm run start:prod", spawnOptions);

  return waitForAppToBeReady(serverProcess);
}

async function forceKillAppProcessAfterTimeout(serverProcess: ChildProcessWithoutNullStreams): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve, APP_READINESS_TIMEOUT_MS);
    const forceKillTimeout = setTimeout(() => {
      if (!serverProcess.killed) {
        serverProcess.kill("SIGKILL");
      }
      resolve();
    }, APP_FORCE_KILL_TIMEOUT_MS);

    serverProcess.on("exit", () => {
      clearTimeout(forceKillTimeout);
      resolve();
    });
  });
}

async function killAppProcess(serverProcess: ChildProcessWithoutNullStreams): Promise<void> {
  serverProcess.kill("SIGTERM");

  await forceKillAppProcessAfterTimeout(serverProcess);
}

export {
  buildAppForAcceptanceTests,
  serveAppForAcceptanceTests,
  killAppProcess,
};