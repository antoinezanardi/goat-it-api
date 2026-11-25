import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";
import { LOCALIZED_TEXT_MONGOOSE_SCHEMA, LocalizedTextMongooseSchema } from "@shared/infrastructure/persistence/mongoose/schemas/localization/localized-text.mongoose.schema";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

describe(LocalizedTextMongooseSchema, () => {
  it("should define exactly one path per supported locale when the schema is built.", () => {
    expect(Object.keys(LOCALIZED_TEXT_MONGOOSE_SCHEMA.paths)).toStrictEqual([...LOCALES]);
  });

  it.each<{ test: string; locale: Locale }>(LOCALES.map((locale): { test: string; locale: Locale } => ({
    test: `should define the "${locale}" path as a string when the schema is built.`,
    locale,
  })))("$test", ({ locale }) => {
    expect(LOCALIZED_TEXT_MONGOOSE_SCHEMA.path(locale).instance).toBe("String");
  });

  it.each<{ test: string; locale: Locale }>(LOCALES.map((locale): { test: string; locale: Locale } => ({
    test: `should not require the "${locale}" path when the schema is built.`,
    locale,
  })))("$test", ({ locale }) => {
    expect(LOCALIZED_TEXT_MONGOOSE_SCHEMA.path(locale).isRequired).toBe(false);
  });
});