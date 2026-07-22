import { createStatsZeroFilledRecord } from "@shared/application/mappers/stats/stats.helpers";

describe(createStatsZeroFilledRecord, () => {
  it.each<{ keys: readonly string[]; expected: Record<string, number> }>([
    { keys: ["alpha", "beta", "gamma"], expected: { alpha: 0, beta: 0, gamma: 0 } },
    { keys: [], expected: {} },
    { keys: ["only"], expected: { only: 0 } },
  ])("should return a record with all keys set to zero when given $keys.", ({ keys, expected }) => {
    expect(createStatsZeroFilledRecord(keys)).toStrictEqual(expected);
  });

  it("should overwrite initial zero value when existingValues contains a matching key.", () => {
    const result = createStatsZeroFilledRecord(["alpha", "beta", "gamma"] as const, { alpha: 5, beta: 10 });

    expect(result.alpha).toBe(5);
  });

  it("should keep zero value when existingValues does not contain the key.", () => {
    const result = createStatsZeroFilledRecord(["alpha", "beta", "gamma"] as const, { alpha: 5, beta: 10 });

    expect(result.gamma).toBe(0);
  });

  it("should return zero-filled record unchanged when existingValues is undefined.", () => {
    const result = createStatsZeroFilledRecord(["alpha", "beta"] as const);

    expect(result).toStrictEqual({ alpha: 0, beta: 0 });
  });

  it("should return zero-filled record unchanged when existingValues is empty.", () => {
    const result = createStatsZeroFilledRecord(["alpha", "beta"] as const, {});

    expect(result).toStrictEqual({ alpha: 0, beta: 0 });
  });
});