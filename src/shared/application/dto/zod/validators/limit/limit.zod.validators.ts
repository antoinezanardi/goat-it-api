import { z } from "zod";

import { normalizeBlankLimitToNaN } from "@shared/application/dto/zod/preprocessors/limit/limit.zod.preprocessors";
import { LIMIT_DESCRIPTION, LIMIT_DEFAULT, LIMIT_MINIMUM } from "@shared/application/dto/zod/validators/limit/constants/limit.zod.validators.constants";

import type { ZodCoercedNumber, ZodDefault, ZodOptional, ZodPreprocess } from "zod";

function zLimit(): ZodPreprocess<ZodDefault<ZodOptional<ZodCoercedNumber>>> {
  return z.preprocess(
    normalizeBlankLimitToNaN,
    z.coerce.number()
      .int()
      .min(LIMIT_MINIMUM)
      .optional()
      .default(LIMIT_DEFAULT),
  )
    .describe(LIMIT_DESCRIPTION)
    .meta({ example: LIMIT_DEFAULT });
}

export { zLimit };