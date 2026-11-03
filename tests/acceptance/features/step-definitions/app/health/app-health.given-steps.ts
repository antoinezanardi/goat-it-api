import { Given } from "@cucumber/cucumber";

import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Given(/^the client retrieves the application health$/u, async function(this: GoatItWorld): Promise<void> {
  await this.fetchAndStoreResponse("/health");
});

Given(/^the client checks the application health using a HEAD request$/u, async function(this: GoatItWorld): Promise<void> {
  await this.fetchAndStoreResponse("/health", createFetchOptions({ method: "HEAD" }));
});