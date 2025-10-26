import { Given } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Given(/^I retrieve the application metadata$/u, async function(this: GoatItWorld): Promise<void> {
  await this.fetchAndStoreResponse("/");
});