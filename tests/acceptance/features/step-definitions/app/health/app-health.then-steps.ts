import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import type { AppHealthDto } from "@src/infrastructure/api/health/dto/app-health/app-health.dto.shape";
import { APP_HEALTH_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health.dto.shape";
import { DOCS_ENDPOINT_HEALTH_KEY, MONGOOSE_HEALTH_KEY } from "@src/infrastructure/api/health/constants/health.constants";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the application good health should be returned$/u, function(this: GoatItWorld): void {
  const health = this.expectLastResponseJson<AppHealthDto>(APP_HEALTH_DTO);

  expect(health.status).toBe("ok");
  expect(health.details[MONGOOSE_HEALTH_KEY].status).toBe("up");
  expect(health.details[DOCS_ENDPOINT_HEALTH_KEY].status).toBe("up");
});