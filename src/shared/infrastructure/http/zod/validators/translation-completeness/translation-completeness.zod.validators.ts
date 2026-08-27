import { z } from "zod";

import type { ZodBoolean, ZodCodec, ZodNumber, ZodObject, ZodOptional, ZodString } from "zod";

function zIsFullyTranslated(): ZodOptional<ZodCodec<ZodString, ZodBoolean>> {
  return z.stringbool({ truthy: ["true"], falsy: ["false"] })
    .optional()
    .describe("Filters resources by whether every LocalizedText/LocalizedTexts field has all 6 supported locales set");
}

function zTranslationCompletenessStats(): ZodObject<z.util.Writeable<{ fullyTranslated: ZodNumber; incomplete: ZodNumber }>, z.core.$strict> {
  return z.strictObject({
    fullyTranslated: z.number().int().nonnegative()
      .describe("Number of resources that are fully translated across all locales"),
    incomplete: z.number().int().nonnegative()
      .describe("Number of resources missing at least one locale in at least one field"),
  });
}

export { zIsFullyTranslated, zTranslationCompletenessStats };