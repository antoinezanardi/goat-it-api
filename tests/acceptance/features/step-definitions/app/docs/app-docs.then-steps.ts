import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import { SWAGGER_DOCUMENTATION_TITLE } from "@src/infrastructure/api/server/swagger/constants/swagger.constants";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the application reference docs should be returned$/u, function(this: GoatItWorld): void {
  const swaggerHtml = this.expectLastResponseText();

  expect(swaggerHtml).toContain("<!DOCTYPE html>");
  expect(swaggerHtml).toContain(`<title>${SWAGGER_DOCUMENTATION_TITLE}</title>`);
  expect(swaggerHtml).toContain("<div id=\"swagger-ui\">");
});