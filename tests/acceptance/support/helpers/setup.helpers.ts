import { spawn, spawnSync } from "node:child_process";
import { request as fetch } from "node:http";
import path from "node:path";
import { URL } from "node:url";

import { config as loadEnvConfig } from "dotenv";

import { prettyJsonStringify } from "@test-helpers/json/json.helpers";

import { DEFAULT_TAIL_LINES } from "@acceptance-support/constants/logging.constants";
import { APP_BASE_URL, APP_ENV_TEST_PATH, APP_FORCE_KILL_TIMEOUT_MS, APP_HEALTH_OK_STATUS, APP_HEALTH_RETRY_ATTEMPTS, APP_HEALTH_RETRY_DELAY_MS } from "@acceptance-support/constants/app.constants";
import { createLogDirectory, generateRunId, RingBuffer } from "@acceptance-support/helpers/logging.helpers";

import type { ITestCaseHookParameter } from "@cucumber/cucumber";
import type { ChildProcessWithoutNullStreams, SpawnOptions, SpawnOptionsWithoutStdio } from "node:child_process";

import type { AppLogsFlushResult, AppLogsManager } from "@acceptance-support/types/hooks.types";
import type { GoatItWorld } from "@acceptance-support/types/world.types";

function loadEnvTestConfig(): void {
  const envLoadResult = loadEnvConfig({
    path: APP_ENV_TEST_PATH,
    quiet: true,
  });
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

/**
 * Create a handler to flush logs from buffers to files.
 * @param stdoutBuffer
 * @param stderrBuffer
 * @param runId
 */
function createFlushLogsHandler(
  stdoutBuffer: RingBuffer,
  stderrBuffer: RingBuffer,
  runId: string,
): (tailLines?: number) => Promise<AppLogsFlushResult> {
  return async(tailLines: number = DEFAULT_TAIL_LINES): Promise<AppLogsFlushResult> => {
    const logDirectory = await createLogDirectory(runId);
    const stdoutPath = path.resolve(path.join(logDirectory, "app.stdout.log"));
    const stderrPath = path.resolve(path.join(logDirectory, "app.stderr.log"));

    const stdoutTail = stdoutBuffer.tail(tailLines);
    const stderrTail = stderrBuffer.tail(tailLines);

    await Promise.all([
      stdoutBuffer.flushToFile(stdoutPath),
      stderrBuffer.flushToFile(stderrPath),
    ]);

    return { stdoutPath, stderrPath, stdoutTail, stderrTail };
  };
}

function attachBuffersToProcessStreams(
  serverProcess: ChildProcessWithoutNullStreams,
  stdoutBuffer: RingBuffer,
  stderrBuffer: RingBuffer,
): void {
  serverProcess.stdout.on("data", (chunk: Buffer) => {
    stdoutBuffer.append(chunk.toString());
  });

  serverProcess.stderr.on("data", (chunk: Buffer) => {
    stderrBuffer.append(chunk.toString());
  });
}

async function serveAppForAcceptanceTests(): Promise<{ process: ChildProcessWithoutNullStreams; appLogs: AppLogsManager }> {
  const spawnOptions: SpawnOptionsWithoutStdio = {
    shell: true,
  };
  const serverProcess = spawn("pnpm run start:prod:test", spawnOptions);

  const stdoutBuffer = new RingBuffer();
  const stderrBuffer = new RingBuffer();
  const runId = generateRunId();

  attachBuffersToProcessStreams(serverProcess, stdoutBuffer, stderrBuffer);

  const flushLogs = createFlushLogsHandler(stdoutBuffer, stderrBuffer, runId);

  const readyProcess = await waitForAppToBeReady(serverProcess);

  return {
    process: readyProcess,
    appLogs: {
      flushLogs,
      runId,
    },
  };
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

function printDebugOnScenarioFailure(world: GoatItWorld, scenario: ITestCaseHookParameter): void {
  console.error("Scenario:", scenario.pickle.name);

  console.error("-- Stored request payload in World --");
  console.error(prettyJsonStringify(world.payload));

  console.error("-- Last stored request payload in World --");
  console.error(prettyJsonStringify(world.lastPayload));

  console.error("-- Last HTTP response (if any) --");
  if (world.lastFetchResponse) {
    const { _data: data, headers, status } = world.lastFetchResponse;
    console.error("Status:", status);
    console.error("Headers:", prettyJsonStringify(headers));
    console.error("Body:", prettyJsonStringify(data));
  } else {
    console.error("No HTTP response stored on the World.");
  }

  console.error("-- Other World data --");
  console.error("App process PID:", world.appProcess?.pid ?? "<none>");
  console.error("Registered models:", Object.keys(world.models).join(", ") || "<none>");
  console.error("=== End debug ===\n");
}

async function killAppProcess(serverProcess: ChildProcessWithoutNullStreams): Promise<void> {
  serverProcess.kill("SIGTERM");

  await forceKillAppProcessAfterTimeout(serverProcess);
}

export {
  loadEnvTestConfig,
  buildAppForAcceptanceTests,
  serveAppForAcceptanceTests,
  printDebugOnScenarioFailure,
  killAppProcess,
};