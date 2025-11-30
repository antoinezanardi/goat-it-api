import { createFakeQuestionThemeDocument } from "@faketories/contexts/question/question-theme/question-theme.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

const TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET = [
  createFakeQuestionThemeDocument({
    label: createFakeLocalizedText({
      en: "Cinema",
      fr: undefined,
      pt: undefined,
      it: undefined,
      es: undefined,
      de: undefined,
    }),
    aliases: createFakeLocalizedTexts({
      en: ["Movies", "Films"],
      fr: undefined,
      pt: undefined,
      it: undefined,
      es: undefined,
      de: undefined,
    }),
    description: createFakeLocalizedText({
      en: "Theme about cinema and movies.",
      fr: undefined,
      pt: undefined,
      it: undefined,
      es: undefined,
      de: undefined,
    }),
    status: "active",
    parentId: undefined,
  }),
  createFakeQuestionThemeDocument({
    label: createFakeLocalizedText({
      en: "Music",
      fr: undefined,
      pt: undefined,
      it: undefined,
      es: undefined,
      de: undefined,
    }),
    aliases: createFakeLocalizedTexts({
      en: ["Songs", "Tunes"],
      fr: undefined,
      pt: undefined,
      it: undefined,
      es: undefined,
      de: undefined,
    }),
    description: createFakeLocalizedText({
      en: "Theme about music, artists and music genres.",
      fr: undefined,
      pt: undefined,
      it: undefined,
      es: undefined,
      de: undefined,
    }),
    status: "active",
    parentId: undefined,
  }),
] as const;

export { TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET };