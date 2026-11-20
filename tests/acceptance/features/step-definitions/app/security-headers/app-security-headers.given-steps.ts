import { Given } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Given(/^the client retrieves an unknown application route$/u, async function(this: GoatItWorld): Promise<void> {
  await this.fetchAndStoreResponse("/unknown-route");
});

Given(/^the client retrieves the application metadata with an invalid locale$/u, async function(this: GoatItWorld): Promise<void> {
  await this.fetchAndStoreResponse("/", { headers: { "Accept-Language": "invalid-locale" } });
});