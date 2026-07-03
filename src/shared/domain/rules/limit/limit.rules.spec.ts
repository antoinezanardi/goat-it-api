import { hasLimit } from "@shared/domain/rules/limit/limit.rules";

describe("Limit Rules", () => {
  describe(hasLimit, () => {
    it.each<{ limit: number | undefined; expected: boolean }>([
      { limit: undefined, expected: false },
      { limit: 0, expected: false },
      { limit: 1, expected: true },
      { limit: 50, expected: true },
      { limit: 100, expected: true },
    ])("should return $expected when limit is $limit.", ({ limit, expected }) => {
      const isLimited = hasLimit(limit);

      expect(isLimited).toBe(expected);
    });
  });
});