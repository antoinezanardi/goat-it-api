import { Given } from "@cucumber/cucumber";

import { SWAGGER_DOCUMENTATION_PATH } from "@src/infrastructure/api/server/swagger/constants/swagger.constants";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Given(/^the client retrieves the application reference docs$/u, async function(this: GoatItWorld): Promise<void> {
  await this.fetchAndStoreResponse(SWAGGER_DOCUMENTATION_PATH);
});