import { z } from "zod";

import { zCreateFilterArray } from "@shared/application/dto/zod/validators/array/array.zod.validators";

describe(zCreateFilterArray, () => {
  it.each<{
    test: string;
    value: unknown;
    expected: boolean;
  }>([
    {
      test: "should pass validation when valid array items are provided without min/max bounds",
      value: ["a", "b"],
      expected: true,
    },
    {
      test: "should pass validation when undefined is provided",
      value: undefined,
      expected: true,
    },
    {
      test: "should fail validation when duplicate values are provided",
      value: ["a", "a"],
      expected: false,
    },
  ])("$test", ({ value, expected }) => {
    const schema = zCreateFilterArray(z.string(), "Items must be unique", "A filter array");
    const result = schema.safeParse(value);

    expect(result.success).toBe(expected);
  });

  it("should fail validation when values do not match the inner schema.", () => {
    const schema = zCreateFilterArray(z.number(), "Items must be unique", "A filter array");
    const result = schema.safeParse(["not-a-number"]);

    expect(result.success).toBeFalsy();
  });

  it("should normalize a single string value to an array when parsed.", () => {
    const schema = zCreateFilterArray(z.string(), "Items must be unique", "A filter array");
    const result = schema.safeParse("single-value");

    expect(result.data).toStrictEqual(["single-value"]);
  });

  it("should pass validation when the normalized single value is valid.", () => {
    const schema = zCreateFilterArray(z.string(), "Items must be unique", "A filter array");
    const result = schema.safeParse("single-value");

    expect(result.success).toBeTruthy();
  });

  it.each<{
    test: string;
    value: unknown;
    expected: boolean;
  }>([
    {
      test: "should fail validation when array is below the minItems bound",
      value: ["a"],
      expected: false,
    },
    {
      test: "should pass validation when array meets the minItems bound",
      value: ["a", "b"],
      expected: true,
    },
    {
      test: "should pass validation when array meets the maxItems bound",
      value: ["a", "b"],
      expected: true,
    },
    {
      test: "should fail validation when array exceeds the maxItems bound",
      value: ["a", "b", "c"],
      expected: false,
    },
  ])("$test", ({ value, expected }) => {
    const schema = zCreateFilterArray(z.string(), "Items must be unique", "A filter array with bounds", 2, 2);
    const result = schema.safeParse(value);

    expect(result.success).toBe(expected);
  });

  it.each<{
    test: string;
    value: unknown;
    expected: boolean;
  }>([
    {
      test: "should fail validation when array is below the minItems bound with both min and max",
      value: ["a"],
      expected: false,
    },
    {
      test: "should pass validation when array is within both minItems and maxItems bounds",
      value: ["a", "b"],
      expected: true,
    },
    {
      test: "should fail validation when array exceeds the maxItems bound with both min and max",
      value: ["a", "b", "c", "d"],
      expected: false,
    },
  ])("$test", ({ value, expected }) => {
    const schema = zCreateFilterArray(z.string(), "Items must be unique", "A filter array with min and max", 2, 3);
    const result = schema.safeParse(value);

    expect(result.success).toBe(expected);
  });

  it("should have the correct description when called.", () => {
    const schema = zCreateFilterArray(z.string(), "Items must be unique", "A custom filter description");

    expect(schema.description).toBe("A custom filter description");
  });

  it("should return the correct uniqueness error message when duplicates are present.", () => {
    const schema = zCreateFilterArray(z.string(), "Custom uniqueness message", "A filter array");
    const result = schema.safeParse(["a", "a"]);

    expect(result.error?.issues[0].message).toBe("Custom uniqueness message");
  });
});