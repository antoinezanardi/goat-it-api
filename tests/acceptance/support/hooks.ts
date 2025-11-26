import { After, AfterAll, Before, BeforeAll, setWorldConstructor } from "@cucumber/cucumber";

import { closeTestDatabaseConnection, connectToTestDatabase, resetTestDatabase } from "@acceptance-support/helpers/test-database.helpers";
import { buildAppForAcceptanceTests, killAppProcess, serveAppForAcceptanceTests } from "@acceptance-support/helpers/setup.helpers";

import { GoatItWorld } from "@acceptance-support/types/world.types";

setWorldConstructor(GoatItWorld);

BeforeAll(async function() {
  buildAppForAcceptanceTests();
  await connectToTestDatabase();
});

Before(async function(this: GoatItWorld) {
  await resetTestDatabase();
  this.appProcess = await serveAppForAcceptanceTests();
});

After(async function(this: GoatItWorld) {
  if (this.appProcess) {
    await killAppProcess(this.appProcess);
  }
});

AfterAll(async function() {
  await closeTestDatabaseConnection();
});