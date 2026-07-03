import { z } from "zod";

import {
  LIMIT_DESCRIPTION,
  LIMIT_DEFAULT,
  LIMIT_MINIMUM,
} from "@shared/infrastructure/http/zod/validators/limit/constants/limit.zod.validators.constants";
import { zLimit } from "@shared/infrastructure/http/zod/validators/limit/limit.zod.validators";

describe("Limit Zod Validators", () => {
  describe(zLimit, () => {
    it.each([LIMIT_MINIMUM, 1, LIMIT_DEFAULT, 100])("should pass validation when limit is %d.", (limit: number) => {
      const schema = zLimit();
      const result = schema.safeParse(limit);

      expect(result.success).toBeTruthy();
    });

    it.each([-1, 1.5, "string"])("should throw zod error when limit is '%s'.", (invalidLimit: unknown) => {
      const schema = zLimit();

      expect(() => schema.parse(invalidLimit)).toThrow(z.ZodError);
    });

    it("should coerce to a number when limit is a numeric string.", () => {
      const schema = zLimit();
      const result = schema.parse("50");

      expect(result).toBe(50);
    });

    it("should use default value 50 when limit is not provided.", () => {
      const schema = zLimit();
      const result = schema.parse(undefined);

      expect(result).toBe(LIMIT_DEFAULT);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const schema = zLimit();
      const metadata = schema.meta();

      expect(metadata).toStrictEqual<Record<string, unknown>>({
        description: LIMIT_DESCRIPTION,
        example: LIMIT_DEFAULT,
      });
    });

    it("should accept any coercible value when checking the input type.", () => {
      expectTypeOf<z.input<ReturnType<typeof zLimit>>>().toEqualTypeOf<unknown>();
    });
  });
});