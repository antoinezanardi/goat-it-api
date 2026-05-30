import { pickDefinedValues } from "@shared/domain/rules/object/object.rules";

describe("Object Rules", () => {
  describe(pickDefinedValues, () => {
    it("should return object with only defined values when some values are undefined.", () => {
      const input = { name: "hello", age: undefined, score: 42 };

      const result = pickDefinedValues(input);

      expect(result).toStrictEqual({ name: "hello", score: 42 });
    });

    it("should return undefined when all values are undefined.", () => {
      const input = { name: undefined, age: undefined };

      const result = pickDefinedValues(input);

      expect(result).toBeUndefined();
    });

    it("should return undefined when object is empty.", () => {
      const input = {};

      const result = pickDefinedValues(input);

      expect(result).toBeUndefined();
    });

    it("should return all values when none are undefined.", () => {
      const input = { name: "x", age: 1, isActive: true };

      const result = pickDefinedValues(input);

      expect(result).toStrictEqual({ name: "x", age: 1, isActive: true });
    });

    it("should preserve falsy values that are not undefined when called.", () => {
      const input = { count: 0, label: "", isActive: false, data: null };

      const result = pickDefinedValues(input);

      expect(result).toStrictEqual({ count: 0, label: "", isActive: false, data: null });
    });
  });
});