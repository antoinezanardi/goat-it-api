import { Given } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Given(/^the client retrieves the application reference docs$/u, async function(this: GoatItWorld): Promise<void> {
  await this.fetchAndStoreResponse("/docs");
});