import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import { APP_METADATA_SCHEMA } from "@app/types/app.constants";

import type { AppMetadata } from "@app/types/app.types";
import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the application metadata should be returned$/u, function(this: GoatItWorld): void {
  const appMetadata = this.expectLastResponseJson<AppMetadata>(APP_METADATA_SCHEMA);

  expect(appMetadata.name).toBe("Goat It API");
  expect((/^\d+\.\d+\.\d+(?:-.+)?$/u).exec(appMetadata.version)).toBeTruthy();
  expect(appMetadata.description).toBe("🐐 Goat It API is a fast and efficient API built with NestJS and Fastify, " +
    "designed to provide seamless backend services for Goat It applications.");
  expect(appMetadata.packageName).toBe("goat-it-api");
});