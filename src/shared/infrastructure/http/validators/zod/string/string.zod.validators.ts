import { isMongoId } from "validator";
import { z } from "zod";

import { SLUG_REGEX } from "@shared/infrastructure/http/validators/patterns/constants/patterns.validators.constants";

import type { $ZodCustomParams } from "zod/v4/core";
import type { ZodString } from "zod";

function zSlug(options: Partial<$ZodCustomParams> = {}): ZodString {
  return z.string().regex(SLUG_REGEX, {
    error: "Invalid kebab-case value",
    ...options,
  });
}

function zMongoId(options: Partial<$ZodCustomParams> = {}): ZodString {
  return z.string().refine(isMongoId, {
    error: "Invalid ObjectId value",
    ...options,
  });
}

export {
  zSlug,
  zMongoId,
};