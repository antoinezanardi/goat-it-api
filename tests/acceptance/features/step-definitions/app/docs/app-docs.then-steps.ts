import type { GoatItWorld } from "@acceptance-support/types/world.types";
import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

Then(/^the application reference docs should be returned$/u, function(this: GoatItWorld): void {
  const swaggerHtml = this.expectLastResponseText();

  expect(swaggerHtml).toContain("<!DOCTYPE html>");
  expect(swaggerHtml).toContain("<title>Goat It API Reference Documentation</title>");
  expect(swaggerHtml).toContain("<div id=\"swagger-ui\">");
});