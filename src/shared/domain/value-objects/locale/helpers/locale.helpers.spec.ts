import { isValidLocale } from "@shared/domain/value-objects/locale/helpers/locale.helpers";

describe("Locale Helpers", () => {
  describe(isValidLocale, () => {
    it.each<{
      test: string;
      input: string;
      expected: boolean;
    }>([
      {
        test: "should return true when the locale is 'en'",
        input: "en",
        expected: true,
      },
      {
        test: "should return true when the locale is 'fr'",
        input: "fr",
        expected: true,
      },
      {
        test: "should return true when the locale is 'es'",
        input: "es",
        expected: true,
      },
      {
        test: "should return true when the locale is 'de'",
        input: "de",
        expected: true,
      },
      {
        test: "should return true when the locale is 'it'",
        input: "it",
        expected: true,
      },
      {
        test: "should return true when the locale is 'pt'",
        input: "pt",
        expected: true,
      },
      {
        test: "should return false when the locale is 'jp",
        input: "jp",
        expected: false,
      },
      {
        test: "should return false when the locale is an empty string",
        input: "",
        expected: false,
      },
      {
        test: "should return false when the locale is 'invalid-locale'",
        input: "invalid-locale",
        expected: false,
      },
    ])("$test", ({ input, expected }) => {
      const isValid = isValidLocale(input);

      expect(isValid).toBe(expected);
    });
  });
});