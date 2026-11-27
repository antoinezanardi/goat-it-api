import { Test } from "@nestjs/testing";

import { HealthController } from "@src/infrastructure/api/health/controllers/health.controller";
import { HealthService } from "@src/infrastructure/api/health/providers/services/health.service";
import { HealthModule } from "@src/infrastructure/api/health/health.module";

import { AppConfigTestingModule } from "@unit-tests/utils/helpers/nest/app-config-testing.module";

import type { Type } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";

describe(HealthModule, () => {
  let module: TestingModule;

  beforeEach(async() => {
    module = await Test.createTestingModule({ imports: [AppConfigTestingModule, HealthModule] }).compile();
  });

  afterEach(async() => {
    await module.close();
  });

  it.each<{ provider: Type<unknown> }>([
    { provider: HealthController },
    { provider: HealthService },
  ])("should resolve $provider when the health module is compiled.", ({ provider }) => {
    expect(module.get(provider)).toBeInstanceOf(provider);
  });
});