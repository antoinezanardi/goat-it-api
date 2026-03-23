import { z } from "zod";

import { HEX_COLOR_REGEX, HEX_COLOR_EXAMPLE, ISO_DATE_TIME_EXAMPLE, MONGO_ID_REGEX, SLUG_MAX_LENGTH, SLUG_MIN_LENGTH, SLUG_REGEX } from "@shared/infrastructure/http/zod/validators/string/constants/string.zod.validators.constants";

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
    .regex(MONGO_ID_REGEX, {
      error: "Invalid ObjectId value",
      ...options,
    })
    .toLowerCase()
    .meta({ example: "60af924f4f1a2563f8e8b456" });
}

function zIsoDateTime(options: Partial<$ZodCustomParams> = {}): ZodISODateTime {
  return z.iso.datetime({
    error: "Invalid ISO 8601 datetime value",
    ...options,
  })
    .meta({ example: ISO_DATE_TIME_EXAMPLE });
}

function zHexColor(options: Partial<$ZodCustomParams> = {}): ZodString {
  return z.string()
    .trim()
    .regex(HEX_COLOR_REGEX, {
      error: "Invalid hex color; must be 6 hexadecimal digits with # prefix (e.g., #FF5733)",
      ...options,
    })
    .toUpperCase()
    .meta({ example: HEX_COLOR_EXAMPLE });
}

export {
  zSlug,
  zMongoId,
  zIsoDateTime,
  zHexColor,
};