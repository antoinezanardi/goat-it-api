import { isMongoId } from "validator";
import { z } from "zod";

import { SLUG_MAX_LENGTH, SLUG_MIN_LENGTH, SLUG_REGEX } from "@shared/infrastructure/http/validators/zod/string/constants/string.zod.validators.constants";

import type { $ZodCustomParams } from "zod/v4/core";
import type { ZodString } from "zod";

function zSlug(options: Partial<$ZodCustomParams> = {}): ZodString {
  return z.string()
    .trim()
    .min(SLUG_MIN_LENGTH)
    .max(SLUG_MAX_LENGTH)
    .regex(SLUG_REGEX, {
      error: "Invalid kebab-case value",
      ...options,
    });
}

function zMongoId(options: Partial<$ZodCustomParams> = {}): ZodString {
  return z.string()
    .trim()
    .refine(isMongoId, {
      error: "Invalid ObjectId value",
      ...options,
    });
}

export {
  zSlug,
  zMongoId,
};