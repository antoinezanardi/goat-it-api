import {
  areValuesUniqueFromStrings,
  areValuesUniqueByKey,
  hasExactlyOneByKey,
} from "@shared/application/dto/zod/refinements/array/array.zod.refinements";

describe("Array Zod Refinements Helpers", () => {
  describe(areValuesUniqueFromStrings, () => {
    it.each<{
      test: string;
      input: string[];
      expected: boolean;
    }>([
      {
        test: "should return true when all string values are unique.",
        input: ["a", "b", "c"],
        expected: true,
      },
      {
        test: "should return false when duplicate string values exist.",
        input: ["a", "b", "a"],
        expected: false,
      },
      {
        test: "should return true for empty string arrays.",
        input: [],
        expected: true,
      },
      {
        test: "should treat values with different cases as distinct when checking uniqueness.",
        input: ["a", "A"],
        expected: true,
      },
    ])("$test", ({ input, expected }) => {
      const isValid = areValuesUniqueFromStrings(input);

      expect(isValid).toBe(expected);
    });
  });

  describe(areValuesUniqueByKey, () => {
    it.each<{
      test: string;
      input: Record<string, unknown>[];
      key: string;
      expected: boolean;
    }>([
      {
        test: "should return true when object key values are unique.",
        input: [{ id: "1" }, { id: "2" }],
        key: "id",
        expected: true,
      },
      {
        test: "should return false when duplicate object key values exist (after string coercion).",
        input: [{ id: 1 }, { id: "1" }],
        key: "id",
        expected: false,
      },
      {
        test: "should return false when objects share the same numeric key value.",
        input: [{ value: 2 }, { value: 2 }],
        key: "value",
        expected: false,
      },
      {
        test: "should return true for empty object arrays when checking uniqueness by key.",
        input: [],
        key: "id",
        expected: true,
      },
    ])("$test", ({ input, key, expected }) => {
      const isValid = areValuesUniqueByKey(input, key);

      expect(isValid).toBe(expected);
    });
  });

  describe(hasExactlyOneByKey, () => {
    it.each<{
      test: string;
      input: Record<string, unknown>[];
      key: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when exactly one item matches the boolean key.",
        input: [{ isPrimary: true }, { isPrimary: false }],
        key: "isPrimary",
        value: true,
        expected: true,
      },
      {
        test: "should return false when no items match the key/value.",
        input: [{ isPrimary: false }, { isPrimary: false }],
        key: "isPrimary",
        value: true,
        expected: false,
      },
      {
        test: "should return false when more than one item matches the key/value.",
        input: [{ isPrimary: true }, { isPrimary: true }],
        key: "isPrimary",
        value: true,
        expected: false,
      },
      {
        test: "should return true when exactly one item matches a string value.",
        input: [{ status: "primary" }, { status: "secondary" }],
        key: "status",
        value: "primary",
        expected: true,
      },
    ])("$test", ({ input, key, value, expected }) => {
      const isValid = hasExactlyOneByKey(input, key, value);

      expect(isValid).toBe(expected);
    });
  });
});