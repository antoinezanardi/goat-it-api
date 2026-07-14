import { After, AfterAll, Before, BeforeAll, setWorldConstructor, Status } from "@cucumber/cucumber";

import { loadEnvTestConfig } from "@acceptance-support/helpers/setup/env.helpers";
import { DEFAULT_SERVER_PORT } from "@acceptance-support/constants/app.constants";
import { killAppProcess } from "@acceptance-support/helpers/setup/process.helpers";
import { flushAndPrintLogTail } from "@acceptance-support/helpers/setup/logging.helpers";
import { printDebugOnScenarioFailure, serveAppForAcceptanceTests } from "@acceptance-support/helpers/setup/setup.helpers";
import { closeTestDatabaseConnection, connectToTestDatabase, resetTestDatabase } from "@acceptance-support/helpers/test-database.helpers";

import type { AcceptanceHooksProcesses } from "@acceptance-support/types/hooks.types";
import { GoatItWorld } from "@acceptance-support/types/world.types";

setWorldConstructor(GoatItWorld);

const processes: AcceptanceHooksProcesses = {};

BeforeAll(async() => {
  loadEnvTestConfig();

  const workerId = process.env.CUCUMBER_WORKER_ID ?? "0";
  process.env.SERVER_PORT = String(DEFAULT_SERVER_PORT + Number(workerId));
  process.env.MONGODB_DATABASE = `goat-it-test-${workerId}`;

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

After(async function(this: GoatItWorld, scenario): Promise<void> {
  const status = scenario.result?.status;

  if (status !== Status.FAILED) {
    return;
  }

  if (processes.appLogs) {
    await flushAndPrintLogTail(processes.appLogs, scenario);
  }

  printDebugOnScenarioFailure(this, scenario);
});

AfterAll(async() => {
  await closeTestDatabaseConnection();
  if (processes.app) {
    await killAppProcess(processes.app);
  }
});