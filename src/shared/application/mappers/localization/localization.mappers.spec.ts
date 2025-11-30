import { createTranslationFromLocalizedText, createTranslationsFromLocalizedTexts, getUnknownLocaleWarningMessage } from "@shared/application/mappers/localization/localization.mappers";

import { createFakeLocalizationOptions, createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

describe("Localization Mappers", () => {
  describe(getUnknownLocaleWarningMessage, () => {
    it("should return the correct warning message for unknown locales when called.", () => {
      const localizationOptions = createFakeLocalizationOptions({
        locale: "fr",
        fallbackLocale: "en",
      });

      const expectedMessage = `⚠️ No Translation found for desired locale (${localizationOptions.locale}) and fallback locale (${localizationOptions.fallbackLocale})`;
      const result = getUnknownLocaleWarningMessage(localizationOptions);

      expect(result).toBe(expectedMessage);
    });
  });

  describe(createTranslationFromLocalizedText, () => {
    it("should return the translated text for the desired locale when available.", () => {
      const localizedText = createFakeLocalizedText({
        en: "Hello",
        fr: "Bonjour",
      });
      const localizationOptions = createFakeLocalizationOptions({
        locale: "fr",
        fallbackLocale: "en",
      });

      const result = createTranslationFromLocalizedText(localizedText, localizationOptions);

      expect(result).toBe("Bonjour");
    });

    it("should return the translated text for the fallback locale when the desired locale is not available.", () => {
      const localizedText = createFakeLocalizedText({
        en: "Hello",
        fr: undefined,
      });
      const localizationOptions = createFakeLocalizationOptions({
        locale: "fr",
        fallbackLocale: "en",
      });

      const result = createTranslationFromLocalizedText(localizedText, localizationOptions);

      expect(result).toBe("Hello");
    });

    it("should return a warning message when neither the desired nor the fallback locale is available.", () => {
      const localizedText = createFakeLocalizedText({
        en: undefined,
        fr: undefined,
      });
      const localizationOptions = createFakeLocalizationOptions({
        locale: "fr",
        fallbackLocale: "en",
      });

      const result = createTranslationFromLocalizedText(localizedText, localizationOptions);

      expect(result).toBe("⚠️ No Translation found for desired locale (fr) and fallback locale (en)");
    });
  });

  describe(createTranslationsFromLocalizedTexts, () => {
    it("should return the translated texts for the desired locale when available.", () => {
      const localizedTexts = createFakeLocalizedTexts({
        en: ["Hello", "World"],
        fr: ["Bonjour", "Monde"],
      });
      const localizationOptions = createFakeLocalizationOptions({
        locale: "fr",
        fallbackLocale: "en",
      });

      const result = createTranslationsFromLocalizedTexts(localizedTexts, localizationOptions);

      expect(result).toStrictEqual<string[]>(["Bonjour", "Monde"]);
    });

    it("should return the translated texts for the fallback locale when the desired locale is not available.", () => {
      const localizedTexts = createFakeLocalizedTexts({
        en: ["Hello", "World"],
        fr: undefined,
      });
      const localizationOptions = createFakeLocalizationOptions({
        locale: "fr",
        fallbackLocale: "en",
      });

      const result = createTranslationsFromLocalizedTexts(localizedTexts, localizationOptions);

      expect(result).toStrictEqual<string[]>(["Hello", "World"]);
    });

    it("should return a warning message array when neither the desired nor the fallback locale is available.", () => {
      const localizedTexts = createFakeLocalizedTexts({
        en: undefined,
        fr: undefined,
      });
      const localizationOptions = createFakeLocalizationOptions({
        locale: "fr",
        fallbackLocale: "en",
      });

      const result = createTranslationsFromLocalizedTexts(localizedTexts, localizationOptions);

      expect(result).toStrictEqual<string[]>(["⚠️ No Translation found for desired locale (fr) and fallback locale (en)"]);
    });
  });
});