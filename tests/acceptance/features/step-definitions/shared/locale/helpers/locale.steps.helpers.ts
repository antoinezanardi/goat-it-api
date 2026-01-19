import { expect } from "expect";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

type ExpectedLocalizedValue<K extends string> = Record<K, string> & { locale: Locale };

function expectLocalizedTextFieldToBe<K extends string>(
  localizedTexts: Partial<Record<Locale, string | undefined>> | undefined,
  expected: ExpectedLocalizedValue<K>[],
  field: K,
): void {
  if (!localizedTexts) {
    throw new Error(`Localized texts are undefined when they were expected to be defined for field: ${field}`);
  }
  for (const { locale, [field]: value } of expected) {
    expect(localizedTexts[locale]).toBe(value.trim() || undefined);
  }
}

function expectLocalizedTextsFieldToBe<K extends string>(
  localizedTexts: Partial<Record<Locale, string[] | undefined>>,
  expected: ExpectedLocalizedValue<K>[],
  field: K,
): void {
  for (const { locale, [field]: valueAsString } of expected) {
    const expectedValues = valueAsString.trim() ? valueAsString.split(",").map(value => value.trim()) : undefined;

    expect(localizedTexts[locale]).toStrictEqual(expectedValues);
  }
}

export {
  expectLocalizedTextFieldToBe,
  expectLocalizedTextsFieldToBe,
};