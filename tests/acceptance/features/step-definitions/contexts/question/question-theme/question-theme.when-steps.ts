import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

When(/^the client retrieves all question themes$/u, async function(this: GoatItWorld): Promise<void> {
  await this.fetchAndStoreResponse("/question-themes");
});