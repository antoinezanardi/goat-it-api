import { Given } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Given(/^the client retrieves the application metadata$/u, async function(this: GoatItWorld): Promise<void> {
  await this.fetchAndStoreResponse("/");
});