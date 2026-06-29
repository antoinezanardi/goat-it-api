import { z } from "zod";

import { LIMIT_DESCRIPTION, LIMIT_DEFAULT, LIMIT_MINIMUM } from "@shared/infrastructure/http/zod/validators/limit/constants/limit.zod.validators.constants";

import type { ZodDefault, ZodNumber } from "zod";

function zLimit(): ZodDefault<ZodNumber> {
  return z.number()
    .int()
    .min(LIMIT_MINIMUM)
    .default(LIMIT_DEFAULT)
    .describe(LIMIT_DESCRIPTION)
    .meta({ example: LIMIT_DEFAULT });
}

export { zLimit };