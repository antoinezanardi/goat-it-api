import { isMongoId } from "validator";
import { z } from "zod";

import { ISO_DATE_TIME_EXAMPLE, SLUG_MAX_LENGTH, SLUG_MIN_LENGTH, SLUG_REGEX } from "@shared/infrastructure/http/validators/zod/string/constants/string.zod.validators.constants";

import type { $ZodCustomParams } from "zod/v4/core";
import type { ZodString, ZodISODateTime } from "zod";

function zSlug(options: Partial<$ZodCustomParams> = {}): ZodString {
  return z.string()
    .trim()
    .min(SLUG_MIN_LENGTH)
    .max(SLUG_MAX_LENGTH)
    .regex(SLUG_REGEX, {
      error: "Invalid kebab-case value",
      ...options,
    })
    .meta({ example: "example-slug-value" });
}

function zMongoId(options: Partial<$ZodCustomParams> = {}): ZodString {
  return z.string()
    .trim()
    .refine(isMongoId, {
      error: "Invalid ObjectId value",
      ...options,
    })
    .meta({ example: "60af924f4f1a2563f8e8b456" });
}

function zIsoDateTime(options: Partial<$ZodCustomParams> = {}): ZodISODateTime {
  return z.iso.datetime({
    error: "Invalid ISO 8601 datetime value",
    ...options,
  })
    .meta({ example: ISO_DATE_TIME_EXAMPLE });
}

export {
  zSlug,
  zMongoId,
  zIsoDateTime,
};