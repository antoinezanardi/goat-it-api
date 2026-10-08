import { spawn } from "node:child_process";

import { prettyJsonStringify } from "@test-helpers/json/json.helpers";

import { waitForAppToBeReady } from "@acceptance-support/helpers/setup/http.helpers";
import { attachBuffersToProcessStreams, createFlushLogsHandler, generateRunId, RingBuffer } from "@acceptance-support/helpers/setup/logging.helpers";
import { killAppProcess } from "@acceptance-support/helpers/setup/process.helpers";

import type { ChildProcessWithoutNullStreams } from "node:child_process";
import type { ITestCaseHookParameter as TestCaseHookParameter } from "@cucumber/cucumber";

import type { AppLogsManager } from "@acceptance-support/types/hooks.types";
import type { GoatItWorld } from "@acceptance-support/types/world.types";

async function serveAppForAcceptanceTests(): Promise<{ process: ChildProcessWithoutNullStreams; appLogs: AppLogsManager }> {
  const serverProcess = spawn(process.execPath, ["dist/main"], {
    env: {
      ...process.env,
      NODE_ENV: "test",
    },
    detached: true,
  });

  const stdoutBuffer = new RingBuffer();
  const stderrBuffer = new RingBuffer();
  const runId = generateRunId();

  attachBuffersToProcessStreams(serverProcess, stdoutBuffer, stderrBuffer);

  const flushLogs = createFlushLogsHandler(stdoutBuffer, stderrBuffer, runId);

  try {
    const readyProcess = await waitForAppToBeReady(serverProcess);

    return {
      process: readyProcess,
      appLogs: {
        flushLogs,
        runId,
      },
    };
  } catch(error) {
    await killAppProcess(serverProcess);
    throw error;
  }
}

function printDebugOnScenarioFailure(world: GoatItWorld, scenario: TestCaseHookParameter): void {
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

export {
  serveAppForAcceptanceTests,
  printDebugOnScenarioFailure,
};