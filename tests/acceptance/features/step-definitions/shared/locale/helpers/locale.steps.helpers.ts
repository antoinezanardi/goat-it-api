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
  for (const entry of expected) {
    const value = entry[field];

    expect(localizedTexts[entry.locale]).toBe(value.trim() || undefined);
  }
}

function expectLocalizedTextsFieldToBe<K extends string>(
  localizedTexts: Partial<Record<Locale, string[] | undefined>>,
  expected: ExpectedLocalizedValue<K>[],
  field: K,
): void {
  for (const entry of expected) {
    const valueAsString = entry[field];
    const expectedValues = valueAsString.trim() ? valueAsString.split(",").map(value => value.trim()) : undefined;

    expect(localizedTexts[entry.locale]).toStrictEqual(expectedValues);
  }
}

export {
  expectLocalizedTextFieldToBe,
  expectLocalizedTextsFieldToBe,
};