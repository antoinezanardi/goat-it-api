import { z } from "zod";

import { normalizeToArray } from "@shared/application/dto/zod/preprocessors/array/array.zod.preprocessors";

import type { ZodArray, ZodOptional, ZodPreprocess, ZodType } from "zod";

/**
 * Creates a Zod schema for an optional array filter parameter from query strings.
 * Combines: preprocess(normalizeToArray) → array(innerSchema) → min/max → refine(uniqueness) → optional → describe
 * @param innerSchema - The Zod schema for individual array items
 * @param uniquenessMessage - Error message for duplicate value validation
 * @param description - OpenAPI description for the filter parameter
 * @param minItems - Minimum number of items (optional)
 * @param maxItems - Maximum number of items (optional)
 */
function zCreateFilterArray<T extends ZodType>(
  innerSchema: T,
  uniquenessMessage: string,
  description: string,
  minItems?: number,
  maxItems?: number,
): ZodOptional<ZodPreprocess<ZodArray<T>>> {
  let arraySchema = z.array(innerSchema);

  if (minItems !== undefined) {
    arraySchema = arraySchema.min(minItems);
  }
  if (maxItems !== undefined) {
    arraySchema = arraySchema.max(maxItems);
  }
  return z.preprocess(normalizeToArray, arraySchema)
    .refine(array => new Set(array).size === array.length, { message: uniquenessMessage })
    .optional()
    .describe(description);
}

export { zCreateFilterArray };