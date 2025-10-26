import { When } from "@cucumber/cucumber";

import type { CustomWorld } from "@acceptance-support/world/world.types";

When(/^I retrieve the application metadata$/u, async function(this: CustomWorld): Promise<void> {
  this.response = await fetch("http://localhost:3000");
});