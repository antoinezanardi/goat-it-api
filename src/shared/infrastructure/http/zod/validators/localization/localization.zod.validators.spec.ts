import { zLocalizedText, zLocalizedTextEntry, zLocalizedTextsEntry, zLocalizedTexts, createZLocaleEntries, hasAtLeastOneLocaleValue } from "@shared/infrastructure/http/zod/validators/localization/localization.zod.validators";
import { LOCALIZED_TEXT_EMPTY_ERROR_MESSAGE } from "@shared/infrastructure/http/zod/validators/localization/constants/localization.zod.validators.constants";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

describe("Localization Zod Validators", () => {
  describe(hasAtLeastOneLocaleValue, () => {
    it.each<{
      test: string;
      object: Record<string, unknown>;
      expected: boolean;
    }>([
      {
        test: "should return true when at least one locale value is defined.",
        object: { en: "Hello", fr: undefined },
        expected: true,
      },
      {
        test: "should return false when all locale values are undefined.",
        object: { en: undefined, fr: undefined },
        expected: false,
      },
      {
        test: "should return true when multiple locale values are defined.",
        object: { en: "Hello", fr: "Bonjour" },
        expected: true,
      },
    ])("$test", ({ object, expected }) => {
      const hasLocaleValue = hasAtLeastOneLocaleValue(object);

      expect(hasLocaleValue).toBe(expected);
    });
  });

  describe(createZLocaleEntries, () => {
    it("should create locale entries correctly when called.", () => {
      const entryFactory = (locale: Locale): string => `Label in ${locale}`;
      const expectedEntries: Record<Locale, string> = {
        en: entryFactory("en"),
        fr: entryFactory("fr"),
        de: entryFactory("de"),
        es: entryFactory("es"),
        it: entryFactory("it"),
        pt: entryFactory("pt"),
      };
      const entries = createZLocaleEntries(entryFactory);

      expect(entries).toStrictEqual(expectedEntries);
    });
  });

  describe(zLocalizedTextEntry, () => {
    it.each<{
      test: string;
      locale: Locale;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when localized text entry is valid for \"en\" locale.",
        locale: "en",
        value: "Hello",
        expected: true,
      },
      {
        test: "should return true when localized text entry is valid for \"fr\" locale.",
        locale: "fr",
        value: "Bonjour",
        expected: true,
      },
      {
        test: "should return true when localized text entry is valid even with spaces around for \"en\" locale.",
        locale: "en",
        value: "  Hello  ",
        expected: true,
      },
      {
        test: "should return false when localized text entry is spaces only for \"en\" locale.",
        locale: "en",
        value: "      ",
        expected: false,
      },
      {
        test: "should return false when localized text entry is too long for \"fr\" locale.",
        locale: "fr",
        value: "a".repeat(501),
        expected: false,
      },
      {
        test: "should return false when localized text entry is an empty string for \"en\" locale.",
        locale: "en",
        value: "",
        expected: false,
      },
      {
        test: "should return true when localized text entry is undefined for \"fr\" locale.",
        locale: "fr",
        value: undefined,
        expected: true,
      },
      {
        test: "should return false when localized text entry is a number for \"en\" locale.",
        locale: "en",
        value: 123,
        expected: false,
      },
    ])("$test", ({ locale, value, expected }) => {
      const schema = zLocalizedTextEntry(locale);
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have correct description for the locale when called.", () => {
      const locale: Locale = "fr";
      const schema = zLocalizedTextEntry(locale);

      expect(schema.description).toBe(`Text in French`);
    });

    it("should have correct metadata for the locale when called.", () => {
      const locale: Locale = "de";
      const schema = zLocalizedTextEntry(locale);
      const expectedMetadata = {
        description: `Text in German`,
        example: `Beispieltext auf Deutsch.`,
      };

      expect(schema.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should trim the localized text entry when parsing.", () => {
      const locale: Locale = "en";
      const schema = zLocalizedTextEntry(locale);
      const value = "  Hello World  ";
      const result = schema.parse(value);

      expect(result).toBe("Hello World");
    });
  });

  describe(zLocalizedTextsEntry, () => {
    it.each<{
      test: string;
      locale: Locale;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when localized texts entry is valid for \"en\" locale.",
        locale: "en",
        value: ["Hello", "Hi"],
        expected: true,
      },
      {
        test: "should return true when localized texts entry is valid for \"fr\" locale.",
        locale: "fr",
        value: ["Bonjour", "Salut"],
        expected: true,
      },
      {
        test: "should return false when localized texts entry has an empty string for \"en\" locale.",
        locale: "en",
        value: ["Hello", ""],
        expected: false,
      },
      {
        test: "should return true when localized texts entry is valid even with spaces around for \"en\" locale.",
        locale: "en",
        value: ["  Hello  ", "  Hi  "],
        expected: true,
      },
      {
        test: "should return false when localized texts entry has a spaces only string for \"en\" locale.",
        locale: "en",
        value: ["      ", "      "],
        expected: false,
      },
      {
        test: "should return true when localized texts entry is undefined for \"fr\" locale.",
        locale: "fr",
        value: undefined,
        expected: true,
      },
      {
        test: "should return false when localized texts entry is an empty array for \"en\" locale.",
        locale: "en",
        value: [],
        expected: false,
      },
      {
        test: "should return false when localized texts entry is too long for \"fr\" locale.",
        locale: "fr",
        value: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"],
        expected: false,
      },
      {
        test: "should return false when localized texts entry has a number for \"en\" locale.",
        locale: "en",
        value: [123],
        expected: false,
      },
    ])("$test", ({ locale, value, expected }) => {
      const schema = zLocalizedTextsEntry(locale);
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have correct description for the locale when called.", () => {
      const locale: Locale = "pt";
      const schema = zLocalizedTextsEntry(locale);

      expect(schema.description).toBe(`Texts in Portuguese`);
    });

    it("should trim the localized texts entry when parsing.", () => {
      const locale: Locale = "en";
      const schema = zLocalizedTextsEntry(locale);
      const value = ["  Hello World  ", "  Hi There  "];
      const result = schema.parse(value);

      expect(result).toStrictEqual(["Hello World", "Hi There"]);
    });

    it("should have correct metadata for the locale when called.", () => {
      const locale: Locale = "it";
      const schema = zLocalizedTextsEntry(locale);
      const expectedMetadata = {
        description: `Texts in Italian`,
        example: [`Testo di esempio in italiano.`],
      };

      expect(schema.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe(zLocalizedText, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when localized text object is valid.",
        value: {
          en: "Hello",
          fr: "Bonjour",
        },
        expected: true,
      },
      {
        test: "should return false when localized text object has an invalid entry (empty string).",
        value: {
          en: "",
          fr: "Bonjour",
        },
        expected: false,
      },
      {
        test: "should return true when localized text object has an undefined entry.",
        value: {
          en: "Hello",
          fr: undefined,
        },
        expected: true,
      },
      {
        test: "should return false when localized text object has an invalid entry (number).",
        value: {
          en: "Hello",
          fr: 123,
        },
        expected: false,
      },
      {
        test: "should return false when localized text object is empty.",
        value: {},
        expected: false,
      },
      {
        test: "should return false when localized text object is not an object.",
        value: "Not an object",
        expected: false,
      },
      {
        test: "should return false when localized text object has an unknown locale entry.",
        value: {
          en: "Hello",
          jp: "こんにちは",
        },
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const schema = zLocalizedText();
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have correct description when called.", () => {
      const schema = zLocalizedText();

      expect(schema.description).toBe("Localized text object with translations for multiple languages");
    });

    it("should provide correct error message when all locales are undefined.", () => {
      const schema = zLocalizedText();
      const result = schema.safeParse({});

      expect(result.error?.issues[0].message).toBe(LOCALIZED_TEXT_EMPTY_ERROR_MESSAGE);
    });
  });

  describe(zLocalizedTexts, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when localized texts object is valid.",
        value: {
          en: ["Hello", "Hi"],
          fr: ["Bonjour", "Salut"],
        },
        expected: true,
      },
      {
        test: "should return false when localized texts object has an invalid entry (empty string).",
        value: {
          en: ["Hello", ""],
          fr: ["Bonjour", "Salut"],
        },
        expected: false,
      },
      {
        test: "should return true when localized texts object has an undefined entry.",
        value: {
          en: ["Hello", "Hi"],
          fr: undefined,
        },
        expected: true,
      },
      {
        test: "should return false when localized texts object has an invalid entry (number).",
        value: {
          en: ["Hello", "Hi"],
          fr: [123],
        },
        expected: false,
      },
      {
        test: "should return false when localized texts object has an empty array.",
        value: {
          en: [],
          fr: ["Bonjour"],
        },
        expected: false,
      },
      {
        test: "should return false when localized texts object is empty.",
        value: {},
        expected: false,
      },
      {
        test: "should return false when localized texts object is not an object.",
        value: "Not an object",
        expected: false,
      },
      {
        test: "should return false when localized texts object has an unknown locale entry.",
        value: {
          en: ["Hello", "Hi"],
          jp: ["こんにちは"],
        },
        expected: false,
      },
      {
        test: "should return false when localized texts are an indexed object instead of an array.",
        value: {
          en: { 0: "Hello", 1: "Hi" },
          fr: ["Bonjour", "Salut"],
        },
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const schema = zLocalizedTexts();
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have correct description when called.", () => {
      const schema = zLocalizedTexts();

      expect(schema.description).toBe("Localized texts object with translations for multiple languages");
    });

    it("should provide correct error message when all locales are undefined.", () => {
      const schema = zLocalizedTexts();
      const result = schema.safeParse({});

      expect(result.error?.issues[0].message).toBe(LOCALIZED_TEXT_EMPTY_ERROR_MESSAGE);
    });

    it("should trim each localized text entry when parsing.", () => {
      const schema = zLocalizedTexts();
      const value = {
        en: ["  Hello World  ", "  Hi There  "],
        fr: ["  Bonjour le monde  ", "  Salut là-bas  "],
      };
      const result = schema.parse(value);

      expect(result).toStrictEqual<Record<string, string[]>>({
        en: ["Hello World", "Hi There"],
        fr: ["Bonjour le monde", "Salut là-bas"],
      });
    });
  });
});