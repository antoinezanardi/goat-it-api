import { createZeroFilledRecord } from "@shared/application/mappers/stats/stats.helpers";

describe(createZeroFilledRecord, () => {
  it.each<{ keys: readonly string[]; expected: Record<string, number> }>([
    { keys: ["alpha", "beta", "gamma"], expected: { alpha: 0, beta: 0, gamma: 0 } },
    { keys: [], expected: {} },
    { keys: ["only"], expected: { only: 0 } },
  ])("should return a record with all keys set to zero when given $keys.", ({ keys, expected }) => {
    expect(createZeroFilledRecord(keys)).toStrictEqual(expected);
  });
});