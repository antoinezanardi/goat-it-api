import { GameAuth } from "@src/infrastructure/api/auth/providers/decorators/game-auth/game-auth.decorator";

describe("Game Auth Decorator", () => {
  describe(GameAuth, () => {
    it("should return a decorator function when called.", () => {
      const decorator = GameAuth();

      expectTypeOf(decorator).toBeFunction();
    });
  });
});