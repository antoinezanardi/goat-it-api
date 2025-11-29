import { spawn, spawnSync } from "node:child_process";
import { request as fetch } from "node:http";
import { URL } from "node:url";

import { config as loadEnvConfig } from "dotenv";

import { APP_BASE_URL, APP_ENV_TEST_PATH, APP_FORCE_KILL_TIMEOUT_MS, APP_HEALTH_OK_STATUS, APP_HEALTH_RETRY_ATTEMPTS, APP_HEALTH_RETRY_DELAY_MS } from "@acceptance-support/constants/app.constants";

import type { ChildProcessWithoutNullStreams, SpawnOptions, SpawnOptionsWithoutStdio } from "node:child_process";

function loadEnvTestConfig(): void {
  const envLoadResult = loadEnvConfig({ path: APP_ENV_TEST_PATH });
  if (envLoadResult.error) {
    throw new Error(`Failed to load environment variables from ${APP_ENV_TEST_PATH}: ${envLoadResult.error.message}`);
  }
}

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

async function getApiHealth(): Promise<number> {
  const urlObject = new URL(`${APP_BASE_URL}/health`);

  return new Promise<number>(resolve => {
    const request = fetch(
      {
        hostname: urlObject.hostname,
        port: urlObject.port,
        path: `${urlObject.pathname}${urlObject.search}`,
        method: "GET",
        timeout: 1000,
      },
      response => {
        resolve(response.statusCode ?? 0);
        request.destroy();
      },
    );

    request.on("error", () => {
      resolve(0);
    });

    request.on("timeout", () => {
      request.destroy();
      resolve(0);
    });

    request.end();
  });
}

async function waitForAppToBeReady(serverProcess: ChildProcessWithoutNullStreams): Promise<ChildProcessWithoutNullStreams> {
  for (let attempt = 1; attempt <= APP_HEALTH_RETRY_ATTEMPTS; attempt++) {
    try {
      // oxlint-disable-next-line no-await-in-loop
      const status = await getApiHealth();
      if (status === APP_HEALTH_OK_STATUS) {
        return serverProcess;
      }
    } catch(error) {
      void error;
    }

    if (attempt < APP_HEALTH_RETRY_ATTEMPTS) {
      // oxlint-disable-next-line no-await-in-loop
      await new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();
        }, APP_HEALTH_RETRY_DELAY_MS);
      });
    }
  }

  throw new Error(`❌ Application did not become ready after ${APP_HEALTH_RETRY_ATTEMPTS} attempts.`);
}

async function serveAppForAcceptanceTests(): Promise<ChildProcessWithoutNullStreams> {
  const spawnOptions: SpawnOptionsWithoutStdio = {
    shell: true,
  };
  const serverProcess = spawn("pnpm run start:prod:test", spawnOptions);

  return waitForAppToBeReady(serverProcess);
}

async function forceKillAppProcessAfterTimeout(serverProcess: ChildProcessWithoutNullStreams): Promise<void> {
  return new Promise<void>(resolve => {
    let isSettled = false;

    function settlePromise(): void {
      if (isSettled) {
        return;
      }
      isSettled = true;
      resolve();
    }

    const forceKillTimeout = setTimeout(() => {
      if (!serverProcess.killed) {
        serverProcess.kill("SIGKILL");
      }
      settlePromise();
    }, APP_FORCE_KILL_TIMEOUT_MS);

    serverProcess.on("exit", () => {
      clearTimeout(forceKillTimeout);
      settlePromise();
    });
  });
}

async function killAppProcess(serverProcess: ChildProcessWithoutNullStreams): Promise<void> {
  serverProcess.kill("SIGTERM");

  await forceKillAppProcessAfterTimeout(serverProcess);
}

export {
  loadEnvTestConfig,
  buildAppForAcceptanceTests,
  serveAppForAcceptanceTests,
  killAppProcess,
};