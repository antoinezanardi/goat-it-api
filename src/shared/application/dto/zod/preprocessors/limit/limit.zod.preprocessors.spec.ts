import { normalizeBlankLimitToNaN } from "@shared/application/dto/zod/preprocessors/limit/limit.zod.preprocessors";

describe(normalizeBlankLimitToNaN, () => {
  it.each<unknown>(["", " ".repeat(3), "\t", "\n", "\u{A0}"])("should return NaN when the value is a blank string like '%s'.", (value: unknown) => {
    expect(normalizeBlankLimitToNaN(value)).toBeNaN();
  });

  it.each<{ description: string; value: unknown }>([
    { value: "50", description: "a numeric string" },
    { value: " 50 ", description: "a whitespace-padded numeric string" },
    { value: "abc", description: "a non-numeric string" },
    { value: 0, description: "the number 0" },
    { value: 50, description: "a number" },
    { value: undefined, description: "undefined" },
    { value: null, description: "null" },
    { value: ["a"], description: "an array" },
  ])("should return the value unchanged when the value is $description.", ({ value }) => {
    expect(normalizeBlankLimitToNaN(value)).toBe(value);
  });
});