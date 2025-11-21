import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import { DOCS_ENDPOINT_HEALTH_KEY, HEALTH_CHECK_RESULT_SCHEMA, MONGOOSE_HEALTH_KEY } from "@src/infrastructure/api/health/constants/health.constants";

import type { AppHealthCheckResult } from "@src/infrastructure/api/health/types/health.types";
import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the application good health should be returned$/u, function(this: GoatItWorld): void {
  const health = this.expectLastResponseJson<AppHealthCheckResult>(HEALTH_CHECK_RESULT_SCHEMA);

  expect(health.status).toBe("ok");
  expect(health.details[MONGOOSE_HEALTH_KEY].status).toBe("up");
  expect(health.details[DOCS_ENDPOINT_HEALTH_KEY].status).toBe("up");
});