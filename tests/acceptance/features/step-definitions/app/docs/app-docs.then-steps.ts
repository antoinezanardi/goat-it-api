import type { GoatItWorld } from "@acceptance-support/types/world.types";
import { Then } from "@cucumber/cucumber";
import { SWAGGER_DOCUMENTATION_TITLE } from "@server/constants/swagger.constants";
import { expect } from "expect";

Then(/^the application reference docs should be returned$/u, function(this: GoatItWorld): void {
  const swaggerHtml = this.expectLastResponseText();

  expect(swaggerHtml).toContain("<!DOCTYPE html>");
  expect(swaggerHtml).toContain(`<title>${SWAGGER_DOCUMENTATION_TITLE}</title>`);
  expect(swaggerHtml).toContain("<div id=\"swagger-ui\">");
});