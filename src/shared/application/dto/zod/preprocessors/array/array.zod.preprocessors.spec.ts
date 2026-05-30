import { normalizeToArray } from "@shared/application/dto/zod/preprocessors/array/array.zod.preprocessors";

describe("Normalize To Array", () => {
  it("should return an array containing the string when value is a string.", () => {
    const result = normalizeToArray("hello");

    expect(result).toStrictEqual(["hello"]);
  });

  it.each([
    { value: ["a", "b"], description: "an array" },
    { value: undefined, description: "undefined" },
    { value: 42, description: "a number" },
    { value: null, description: "null" },
  ])("should return the value unchanged when value is $description.", ({ value }) => {
    const result = normalizeToArray(value);

    expect(result).toBe(value);
  });
});