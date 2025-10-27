import { spawn, spawnSync } from "node:child_process";

import { APP_FORCE_KILL_TIMEOUT_MS, APP_READINESS_TIMEOUT_MS } from "@acceptance-support/constants/app.constants";

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
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      serverProcess.kill();
      serverProcess.once("exit", () => {
        reject(new Error("Server failed to start within timeout"));
      });
    }, APP_READINESS_TIMEOUT_MS);

    serverProcess.stdout.on("data", (data: Buffer) => {
      if (data.toString().includes("Goat It API is running on")) {
        clearTimeout(timeout);
        resolve(serverProcess);
      }
    });

    serverProcess.on("error", error => {
      clearTimeout(timeout);
      reject(error);
    });
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