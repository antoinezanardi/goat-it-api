import { z } from "zod";

import type { ZodObject, ZodString, ZodOptional, ZodArray } from "zod";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

function createZLocaleEntries<T>(entryFactory: (localLabel: string) => T): Record<Locale, T> {
  return {
    en: entryFactory("english"),
    fr: entryFactory("french"),
    es: entryFactory("spanish"),
    de: entryFactory("german"),
    it: entryFactory("italian"),
    pt: entryFactory("portuguese"),
  };
}

function zLocalizedTextEntry(localLabel: string): ZodOptional<ZodString> {
  return z.string()
    .min(1)
    .optional()
    .describe(`Text in ${localLabel}.`);
}

function zLocalizedTextsEntry(localLabel: string): ZodOptional<ZodArray<ZodString>> {
  return z.array(z.string().min(1))
    .min(1)
    .optional()
    .describe(`Texts in ${localLabel}.`);
}

function zLocalizedText(): ZodObject<Record<Locale, ZodOptional<ZodString>>> {
  const localeEntries: Record<Locale, ZodOptional<ZodString>> = createZLocaleEntries(zLocalizedTextEntry);

  return z.strictObject(localeEntries)
    .describe("Localized text object with translations for multiple languages.");
}

function zLocalizedTexts(): ZodObject<Record<Locale, ZodOptional<ZodArray<ZodString>>>> {
  const localeEntries: Record<Locale, ZodOptional<ZodArray<ZodString>>> = createZLocaleEntries(zLocalizedTextsEntry);

  return z.strictObject(localeEntries)
    .describe("Localized texts object with translations for multiple languages.");
}

export {
  createZLocaleEntries,
  zLocalizedTextEntry,
  zLocalizedTextsEntry,
  zLocalizedText,
  zLocalizedTexts,
};