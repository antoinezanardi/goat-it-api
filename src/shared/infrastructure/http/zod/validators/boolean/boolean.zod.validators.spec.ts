import { ZodError } from "zod";

import { zStringBoolean } from "@shared/infrastructure/http/zod/validators/boolean/boolean.zod.validators";

describe(zStringBoolean, () => {
  it.each<{ input: unknown; expected: boolean }>([
    { input: "true", expected: true },
    { input: "TRUE", expected: true },
    { input: "True", expected: true },
    { input: "false", expected: false },
    { input: "FALSE", expected: false },
  ])("should parse '$input' to $expected when the input is a valid boolean string.", ({ input, expected }) => {
    const isParsedValue = zStringBoolean().parse(input);

    expect(isParsedValue).toBe(expected);
  });

  it.each<unknown>(["maybe", "", "yes", "no", "0", "1"])("should throw a zod error when the input is '%s'.", input => {
    expect(() => zStringBoolean().parse(input)).toThrow(ZodError);
  });
});