import { pickDefinedValues } from "@shared/domain/rules/object/object.rules";

describe("Object Rules", () => {
  describe(pickDefinedValues, () => {
    it.each<{ input: Record<string, unknown>; expected: Record<string, unknown> | undefined }>([
      { input: { name: "hello", age: undefined, score: 42 }, expected: { name: "hello", score: 42 } },
      { input: { name: undefined, age: undefined }, expected: undefined },
      { input: {}, expected: undefined },
      { input: { name: "x", age: 1, isActive: true }, expected: { name: "x", age: 1, isActive: true } },
      { input: { count: 0, label: "", isActive: false, data: null }, expected: { count: 0, label: "", isActive: false, data: null } },
    ])("should return $expected when input is $input.", ({ input, expected }) => {
      const result = pickDefinedValues(input);

      expect(result).toStrictEqual(expected);
    });
  });
});