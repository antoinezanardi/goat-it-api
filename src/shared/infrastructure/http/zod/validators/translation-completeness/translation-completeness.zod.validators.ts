import { z } from "zod";

import type { ZodBoolean, ZodCodec, ZodNumber, ZodObject, ZodOptional, ZodString } from "zod";

function zIsFullyTranslated(): ZodOptional<ZodCodec<ZodString, ZodBoolean>> {
  return z.stringbool({ truthy: ["true"], falsy: ["false"] })
    .optional()
    .describe("Filters resources by translation completeness: 'true' returns only fully translated resources, 'false' returns only incomplete ones. " +
      "A resource is fully translated when all mandatory LocalizedText/LocalizedTexts fields have a value " +
      "in every applicable locale, and all optional LocalizedText/LocalizedTexts fields are either absent (never translated) " +
      "or have a value in every applicable locale. " +
      "Applicable locales come from the resource's applicableLocales field: if absent or empty, " +
      "all 6 supported locales apply (en, fr, es, de, it, pt).");
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