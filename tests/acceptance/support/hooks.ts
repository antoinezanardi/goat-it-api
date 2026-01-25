import { After, AfterAll, Before, BeforeAll, setWorldConstructor, Status } from "@cucumber/cucumber";

import { buildAppForAcceptanceTests, killAppProcess, loadEnvTestConfig, printDebugOnScenarioFailure, serveAppForAcceptanceTests } from "@acceptance-support/helpers/setup.helpers";
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

  processes.app = await serveAppForAcceptanceTests();
});

Before(async function(this: GoatItWorld) {
  await resetTestDatabase();
  if (!processes.app) {
    throw new Error("The application process was not initialized before the scenario.");
  }
  this.appProcess = processes.app;
});

After(function(this: GoatItWorld, scenario: ITestCaseHookParameter): void {
  const status = scenario.result?.status;

  if (status !== Status.FAILED) {
    return;
  }
  printDebugOnScenarioFailure(this, scenario);
});

AfterAll(async function() {
  await closeTestDatabaseConnection();
  if (processes.app) {
    await killAppProcess(processes.app);
  }
});