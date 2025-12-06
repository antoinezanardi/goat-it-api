import { z } from "zod";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import type { ZodObject, ZodString, ZodOptional, ZodArray } from "zod";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

function zLocalizedTextEntry(locale: Locale): ZodOptional<ZodString> {
  return z.string()
    .min(1)
    .optional()
    .describe(`Text in "${locale}" locale.`);
}

function zLocalizedTextsEntry(locale: Locale): ZodOptional<ZodArray> {
  return z.array(z.string().min(1))
    .min(1)
    .optional()
    .describe(`Texts in "${locale}" locale.`);
}

function zLocalizedText(): ZodObject {
  const localeEntries = Object.fromEntries(LOCALES.map(locale => [locale, zLocalizedTextEntry(locale)]));

  return z.strictObject(localeEntries)
    .describe("Localized text object with translations for multiple languages.");
}

function zLocalizedTexts(): ZodObject {
  const localeEntries = Object.fromEntries(LOCALES.map(locale => [locale, zLocalizedTextsEntry(locale)]));

  return z.object(localeEntries)
    .describe("Localized texts object with translations for multiple languages.");
}

export {
  zLocalizedTextEntry,
  zLocalizedTextsEntry,
  zLocalizedText,
  zLocalizedTexts,
};