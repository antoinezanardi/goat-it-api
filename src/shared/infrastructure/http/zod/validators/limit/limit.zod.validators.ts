import { z } from "zod";

import { LIMIT_DESCRIPTION, LIMIT_DEFAULT, LIMIT_MINIMUM } from "@shared/infrastructure/http/zod/validators/limit/constants/limit.zod.validators.constants";

import type { ZodCoercedNumber, ZodDefault, ZodOptional } from "zod";

function zLimit(): ZodDefault<ZodOptional<ZodCoercedNumber>> {
  return z.coerce.number()
    .int()
    .min(LIMIT_MINIMUM)
    .optional()
    .default(LIMIT_DEFAULT)
    .describe(LIMIT_DESCRIPTION)
    .meta({ example: LIMIT_DEFAULT });
}

export { zLimit };