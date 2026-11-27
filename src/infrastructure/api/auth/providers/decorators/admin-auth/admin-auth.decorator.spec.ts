import { GUARDS_METADATA } from "@nestjs/common/constants";
import { Reflector } from "@nestjs/core";

import { AdminAuth } from "@src/infrastructure/api/auth/providers/decorators/admin-auth/admin-auth.decorator";
import { AdminApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/admin-api-key/admin-api-key.guard";

import type { Type } from "@nestjs/common";

describe(AdminAuth, () => {
  it("should apply the AdminApiKeyGuard to the decorated class when applied.", () => {
    @AdminAuth()
    class StubController {}

    const reflector = new Reflector();
    const guards = reflector.get<Type<unknown>[]>(GUARDS_METADATA, StubController);

    expect(guards).toStrictEqual<Type<unknown>[]>([AdminApiKeyGuard]);
  });
});