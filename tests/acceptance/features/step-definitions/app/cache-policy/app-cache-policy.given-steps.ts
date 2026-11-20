import { Given } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Given(/^the client retrieves the public game asset "(?<assetPath>[^"]+)"$/u, async function(this: GoatItWorld, assetPath: string): Promise<void> {
  await this.fetchAndStoreResponse(assetPath);
});

Given(/^the client retrieves the application reference docs JSON$/u, async function(this: GoatItWorld): Promise<void> {
  await this.fetchAndStoreResponse("/docs-json");
});

Given(/^the client retrieves the application reference docs stylesheet$/u, async function(this: GoatItWorld): Promise<void> {
  await this.fetchAndStoreResponse("/docs/swagger-ui.css");
});