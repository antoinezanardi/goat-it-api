import { createFakeQuestionThemeDocument } from "@faketories/contexts/question/question-theme/question-theme.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

const TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET = [
  createFakeQuestionThemeDocument({
    _id: createFakeObjectId("5cd8edcc5fdf4cf6aaf79c9e"),
    slug: "cinema",
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
  }),
  createFakeQuestionThemeDocument({
    _id: createFakeObjectId("3ff6c1e3ae2fe3fdd9ced1e8"),
    slug: "music",
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
  }),
] as const satisfies ReturnType<typeof createFakeQuestionThemeDocument>[];

export { TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_SET };