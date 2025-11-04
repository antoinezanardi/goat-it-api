import { Given } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";
import { SWAGGER_DOCUMENTATION_PATH } from "@server/constants/swagger.constants";

Given(/^the client retrieves the application reference docs$/u, async function(this: GoatItWorld): Promise<void> {
  await this.fetchAndStoreResponse(SWAGGER_DOCUMENTATION_PATH);
});