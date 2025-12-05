import { createFakeQuestionThemeDocument } from "@faketories/contexts/question/question-theme/question-theme.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

const FIVE_QUESTION_THEMES_FIXTURE_SET = [
  createFakeQuestionThemeDocument({
    _id: createFakeObjectId("8ef21e4eb04eb0fa5a469d87"),
    slug: "cinema",
    label: createFakeLocalizedText({
      fr: "Cinéma",
      en: "Cinema",
    }),
    aliases: createFakeLocalizedTexts({
      fr: ["Films", "Ciné"],
      en: ["Movies", "Films"],
    }),
    description: createFakeLocalizedText({
      fr: "Thème concernant le cinéma et les films.",
      en: "Theme about cinema and movies.",
    }),
    status: "active",
  }),
  createFakeQuestionThemeDocument({
    _id: createFakeObjectId("ddb03d94cae8df38d28e5adc"),
    slug: "music",
    label: createFakeLocalizedText({
      fr: "Musique",
      en: "Music",
    }),
    aliases: createFakeLocalizedTexts({
      fr: ["Chanson", "Son"],
      en: ["Songs", "Tunes"],
    }),
    description: createFakeLocalizedText({
      fr: "Thème lié à la musique, aux artistes et aux genres musicaux.",
      en: "Theme about music, artists and music genres.",
    }),
    status: "active",
  }),
  createFakeQuestionThemeDocument({
    _id: createFakeObjectId("dbb0664ad4797c6cc79d5aee"),
    slug: "sports",
    label: createFakeLocalizedText({
      fr: "Sport",
      en: "Sports",
    }),
    aliases: createFakeLocalizedTexts({
      fr: ["Football", "Jeux"],
      en: ["Football", "Games"],
    }),
    description: createFakeLocalizedText({
      fr: "Thème concernant les sports, compétitions et athlètes.",
      en: "Theme about sports, competitions and athletes.",
    }),
    status: "archived",
  }),
  createFakeQuestionThemeDocument({
    _id: createFakeObjectId("cddb37b90e4f6b7ec27bc1ee"),
    slug: "history",
    label: createFakeLocalizedText({
      fr: "Histoire",
      en: "History",
    }),
    aliases: createFakeLocalizedTexts({
      fr: ["Passé", "Chronologie"],
      en: ["Past", "Chronology"],
    }),
    description: createFakeLocalizedText({
      fr: "Thème sur les événements historiques, personnages et périodes.",
      en: "Theme about historical events, figures and periods.",
    }),
    status: "active",
  }),
  createFakeQuestionThemeDocument({
    _id: createFakeObjectId("9adeceb41db80ab7ec49b457"),
    slug: "science",
    label: createFakeLocalizedText({
      fr: "Science",
      en: "Science",
    }),
    aliases: createFakeLocalizedTexts({
      fr: ["Technologie", "Recherche"],
      en: ["Technology", "Research"],
    }),
    description: createFakeLocalizedText({
      fr: "Thème couvrant les sciences, découvertes et innovations.",
      en: "Theme covering sciences, discoveries and innovations.",
    }),
    status: "active",
  }),
] as const satisfies ReturnType<typeof createFakeQuestionThemeDocument>[];

export { FIVE_QUESTION_THEMES_FIXTURE_SET };