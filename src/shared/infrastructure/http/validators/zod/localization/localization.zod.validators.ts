import { z } from "zod";

import type { ZodObject, ZodString, ZodOptional, ZodArray } from "zod";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

function zLocalizedTextEntry(locale: Locale): ZodOptional<ZodString> {
  return z.string()
    .min(1)
    .optional()
    .describe(`Text in "${locale}" locale.`);
}

function zLocalizedTextsEntry(locale: Locale): ZodOptional<ZodArray<ZodString>> {
  return z.array(z.string().min(1))
    .min(1)
    .optional()
    .describe(`Texts in "${locale}" locale.`);
}

function zLocalizedText(): ZodObject<Record<Locale, ZodOptional<ZodString>>> {
  const localeEntries: Record<Locale, ZodOptional<ZodString>> = {
    en: zLocalizedTextEntry("en"),
    fr: zLocalizedTextEntry("fr"),
    es: zLocalizedTextEntry("es"),
    de: zLocalizedTextEntry("de"),
    it: zLocalizedTextEntry("it"),
    pt: zLocalizedTextEntry("pt"),
  };

  return z.strictObject(localeEntries)
    .describe("Localized text object with translations for multiple languages.");
}

function zLocalizedTexts(): ZodObject<Record<Locale, ZodOptional<ZodArray<ZodString>>>> {
  const localeEntries: Record<Locale, ZodOptional<ZodArray<ZodString>>> = {
    en: zLocalizedTextsEntry("en"),
    fr: zLocalizedTextsEntry("fr"),
    es: zLocalizedTextsEntry("es"),
    de: zLocalizedTextsEntry("de"),
    it: zLocalizedTextsEntry("it"),
    pt: zLocalizedTextsEntry("pt"),
  };

  return z.strictObject(localeEntries)
    .describe("Localized texts object with translations for multiple languages.");
}

export {
  zLocalizedTextEntry,
  zLocalizedTextsEntry,
  zLocalizedText,
  zLocalizedTexts,
};