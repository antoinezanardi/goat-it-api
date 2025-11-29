import { AfterAll, Before, BeforeAll, setWorldConstructor } from "@cucumber/cucumber";
import { config as loadEnvConfig } from "dotenv";

import { APP_TEST_ENV_PATH } from "@acceptance-support/constants/app.constants";
import { buildAppForAcceptanceTests, killAppProcess, serveAppForAcceptanceTests } from "@acceptance-support/helpers/setup.helpers";
import { closeTestDatabaseConnection, connectToTestDatabase, resetTestDatabase } from "@acceptance-support/helpers/test-database.helpers";

import type { AcceptanceHooksProcesses } from "@acceptance-support/types/hooks.types";
import { GoatItWorld } from "@acceptance-support/types/world.types";

setWorldConstructor(GoatItWorld);

const processes: AcceptanceHooksProcesses = {};

BeforeAll(async function() {
  loadEnvConfig({ path: APP_TEST_ENV_PATH });
  buildAppForAcceptanceTests();
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