import { z } from "zod";

import { LOCALE_LABELS } from "@shared/domain/value-objects/locale/locale.constants";
import { LOCALE_EXAMPLES, LOCALIZED_TEXT_ENTRY_MAX_LENGTH, LOCALIZED_TEXT_ENTRY_MIN_LENGTH, LOCALIZED_TEXTS_MAX_LENGTH, LOCALIZED_TEXTS_MIN_LENGTH } from "@shared/infrastructure/http/validators/zod/localization/constants/localization.zod.validators.constants";

import type { ZodObject, ZodString, ZodOptional, ZodArray } from "zod";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

function createZLocaleEntries<T>(entryFactory: (locale: Locale) => T): Record<Locale, T> {
  return {
    en: entryFactory("en"),
    fr: entryFactory("fr"),
    es: entryFactory("es"),
    de: entryFactory("de"),
    it: entryFactory("it"),
    pt: entryFactory("pt"),
  };
}

function zLocalizedTextEntry(locale: Locale): ZodOptional<ZodString> {
  const localeLabel = LOCALE_LABELS[locale];
  const localeExample = LOCALE_EXAMPLES[locale];

  return z.string()
    .trim()
    .min(LOCALIZED_TEXT_ENTRY_MIN_LENGTH)
    .max(LOCALIZED_TEXT_ENTRY_MAX_LENGTH)
    .optional()
    .describe(`Text in ${localeLabel}.`)
    .meta({ example: localeExample });
}

function zLocalizedTextsEntry(locale: Locale): ZodOptional<ZodArray<ZodString>> {
  const localeLabel = LOCALE_LABELS[locale];
  const localeExample = LOCALE_EXAMPLES[locale];

  const zLocalizedTextsValue = z.string()
    .trim()
    .min(LOCALIZED_TEXT_ENTRY_MIN_LENGTH)
    .max(LOCALIZED_TEXT_ENTRY_MAX_LENGTH);

  return z.array(zLocalizedTextsValue)
    .min(LOCALIZED_TEXTS_MIN_LENGTH)
    .max(LOCALIZED_TEXTS_MAX_LENGTH)
    .optional()
    .describe(`Texts in ${localeLabel}.`)
    .meta({ example: [localeExample] });
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