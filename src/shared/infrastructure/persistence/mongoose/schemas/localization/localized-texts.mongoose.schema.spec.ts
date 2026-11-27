import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";
import { LOCALIZED_TEXTS_MONGOOSE_SCHEMA, LocalizedTextsMongooseSchema } from "@shared/infrastructure/persistence/mongoose/schemas/localization/localized-texts.mongoose.schema";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

describe(LocalizedTextsMongooseSchema, () => {
  it("should define exactly one path per supported locale when the schema is built.", () => {
    expect(Object.keys(LOCALIZED_TEXTS_MONGOOSE_SCHEMA.paths)).toStrictEqual([...LOCALES]);
  });

  it.each<{ test: string; locale: Locale }>(LOCALES.map((locale): { test: string; locale: Locale } => ({
    test: `should define the "${locale}" path as a string array when the schema is built.`,
    locale,
  })))("$test", ({ locale }) => {
    expect(LOCALIZED_TEXTS_MONGOOSE_SCHEMA.path(locale).instance).toBe("Array");
  });

  it.each<{ test: string; locale: Locale }>(LOCALES.map((locale): { test: string; locale: Locale } => ({
    test: `should not require the "${locale}" path when the schema is built.`,
    locale,
  })))("$test", ({ locale }) => {
    expect(LOCALIZED_TEXTS_MONGOOSE_SCHEMA.path(locale).isRequired).toBe(false);
  });

  it.each<{ test: string; locale: Locale }>(LOCALES.map((locale): { test: string; locale: Locale } => ({
    test: `should keep an explicit undefined default on the "${locale}" path when the schema is built.`,
    locale,
  })))("$test", ({ locale }) => {
    expect({ ...LOCALIZED_TEXTS_MONGOOSE_SCHEMA.path(locale).options }).toStrictEqual({
      required: false,
      type: [String],
      default: undefined,
    });
  });
});