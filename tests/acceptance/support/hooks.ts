import { After, Before, BeforeAll, setWorldConstructor } from "@cucumber/cucumber";

import { buildAppForAcceptanceTests, killAppProcess, serveAppForAcceptanceTests } from "@acceptance-support/helpers/setup.helpers";

import { GoatItWorld } from "@acceptance-support/types/world.types";

setWorldConstructor(GoatItWorld);

BeforeAll(function() {
  buildAppForAcceptanceTests();
});

Before(async function(this: GoatItWorld) {
  this.appProcess = await serveAppForAcceptanceTests();
});

After(async function(this: GoatItWorld) {
  await killAppProcess(this.appProcess);
});