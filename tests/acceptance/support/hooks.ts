import { After, AfterAll, Before, BeforeAll, setWorldConstructor, Status } from "@cucumber/cucumber";

import { buildAppForAcceptanceTests, killAppProcess, loadEnvTestConfig, printDebugOnScenarioFailure, serveAppForAcceptanceTests } from "@acceptance-support/helpers/setup.helpers";
import { DEFAULT_TAIL_LINES, printLogTail } from "@acceptance-support/helpers/logging.helpers";
import { closeTestDatabaseConnection, connectToTestDatabase, resetTestDatabase } from "@acceptance-support/helpers/test-database.helpers";

import type { ITestCaseHookParameter } from "@cucumber/cucumber";

import type { AcceptanceHooksProcesses } from "@acceptance-support/types/hooks.types";
import { GoatItWorld } from "@acceptance-support/types/world.types";

setWorldConstructor(GoatItWorld);

const processes: AcceptanceHooksProcesses = {};

BeforeAll(async function() {
  loadEnvTestConfig();
  if (process.env.SKIP_BUILD === "true") {
    console.info("⏭️ Skipping application build for acceptance tests as per SKIP_BUILD env variable.");
  } else {
    buildAppForAcceptanceTests();
  }
  await connectToTestDatabase();

  const { process: appProcess, appLogs } = await serveAppForAcceptanceTests();
  processes.app = appProcess;
  processes.appLogs = appLogs;
});

Before(async function(this: GoatItWorld) {
  await resetTestDatabase();
  if (!processes.app) {
    throw new Error("The application process was not initialized before the scenario.");
  }
  this.appProcess = processes.app;
});

After(async function(this: GoatItWorld, scenario: ITestCaseHookParameter): Promise<void> {
  const status = scenario.result?.status;

  if (status !== Status.FAILED) {
    return;
  }

  // Flush logs to files on failure
  if (processes.appLogs) {
    try {
      const { stdoutPath, stderrPath, stdoutTail, stderrTail } = await processes.appLogs.flushLogs();

      // Print log file paths and tails
      console.error(`\n📋 Acceptance test logs saved for failed scenario: "${scenario.pickle.name}"`);
      console.error(`Run ID: ${processes.appLogs.runId}`);

      // Print tails with file paths
      printLogTail("STDOUT", stdoutPath, stdoutTail, DEFAULT_TAIL_LINES);
      printLogTail("STDERR", stderrPath, stderrTail, DEFAULT_TAIL_LINES);
    } catch(error) {
      console.error("Failed to flush acceptance logs:", error);
    }
  }

  printDebugOnScenarioFailure(this, scenario);
});

AfterAll(async function() {
  await closeTestDatabaseConnection();
  if (processes.app) {
    await killAppProcess(processes.app);
  }
});