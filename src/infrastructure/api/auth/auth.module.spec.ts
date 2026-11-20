import { Test } from "@nestjs/testing";

import { AdminApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/admin-api-key/admin-api-key.guard";
import { GameApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/game-api-key/game-api-key.guard";
import { AuthModule } from "@src/infrastructure/api/auth/auth.module";

import { AppConfigTestingModule } from "@unit-tests/utils/helpers/nest/app-config-testing.module";

import type { Type } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";

describe(AuthModule, () => {
  let module: TestingModule;

  beforeEach(async() => {
    module = await Test.createTestingModule({ imports: [AppConfigTestingModule, AuthModule] }).compile();
  });

  afterEach(async() => {
    await module.close();
  });

  it.each<{ guard: Type<unknown> }>([
    { guard: AdminApiKeyGuard },
    { guard: GameApiKeyGuard },
  ])("should resolve $guard when the auth module is compiled.", ({ guard }) => {
    expect(module.get(guard)).toBeInstanceOf(guard);
  });
});