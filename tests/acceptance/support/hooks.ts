import { AfterAll, Before, BeforeAll, setWorldConstructor } from "@cucumber/cucumber";

import { buildAppForAcceptanceTests, killAppProcess, loadEnvTestConfig, serveAppForAcceptanceTests } from "@acceptance-support/helpers/setup.helpers";
import { closeTestDatabaseConnection, connectToTestDatabase, resetTestDatabase } from "@acceptance-support/helpers/test-database.helpers";

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

AfterAll(async function() {
  await closeTestDatabaseConnection();
  if (processes.app) {
    await killAppProcess(processes.app);
  }
});