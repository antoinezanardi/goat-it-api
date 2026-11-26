import { GUARDS_METADATA } from "@nestjs/common/constants";
import { Reflector } from "@nestjs/core";

import { GameAuth } from "@src/infrastructure/api/auth/providers/decorators/game-auth/game-auth.decorator";
import { GameApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/game-api-key/game-api-key.guard";

import type { Type } from "@nestjs/common";

describe(GameAuth, () => {
  it("should apply the GameApiKeyGuard to the decorated class when applied.", () => {
    @GameAuth()
    class StubController {}

    const reflector = new Reflector();
    const guards = reflector.get<Type<unknown>[]>(GUARDS_METADATA, StubController);

    expect(guards).toStrictEqual<Type<unknown>[]>([GameApiKeyGuard]);
  });
});