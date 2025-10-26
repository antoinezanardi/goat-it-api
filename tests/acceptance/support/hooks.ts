import { After, Before } from "@cucumber/cucumber";

import { initAppForAcceptanceTests } from "@acceptance-support/app/app.helpers";

import type { CustomWorld } from "@acceptance-support/world/world.types";

Before(async function(this: CustomWorld) {
  const { app } = await initAppForAcceptanceTests();
  this.app = app;
  throw new Error("Testing hooks.ts file");
});

After(async function(this: CustomWorld) {
  await this.app.close();
});