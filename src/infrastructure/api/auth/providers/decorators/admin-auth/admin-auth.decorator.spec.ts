import { AdminAuth } from "@src/infrastructure/api/auth/providers/decorators/admin-auth/admin-auth.decorator";

describe(AdminAuth, () => {
  it("should return a decorator function when called.", () => {
    const decorator = AdminAuth();

    expectTypeOf(decorator).toBeFunction();
  });
});