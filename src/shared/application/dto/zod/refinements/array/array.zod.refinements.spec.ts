import { areValuesUnique } from "@shared/application/dto/zod/refinements/array/array.zod.refinements";

describe(areValuesUnique, () => {
  it.each<{
    test: string;
    input: unknown[];
    expected: boolean;
  }>([
    {
      test: "should return true when array has unique primitive values.",
      input: [1, 2, 3],
      expected: true,
    },
    {
      test: "should return false when array contains duplicate primitive values.",
      input: [1, 2, 1],
      expected: false,
    },
    {
      test: "should return true for empty arrays.",
      input: [],
      expected: true,
    },
    {
      test: "should return true when different object instances with identical content appear.",
      input: [{ key: 1 }, { key: 1 }],
      expected: true,
    },
  ])("$test", ({ input, expected }) => {
    expect(areValuesUnique(input)).toBe(expected);
  });
});