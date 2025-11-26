import { createFakeQuestionThemeDocument } from "@factories/contexts/question/question-theme/question-theme.factory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@factories/shared/locale/locale.factory";

const FIVE_QUESTION_THEMES_FIXTURE_SET = [
  createFakeQuestionThemeDocument({
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
    parentId: undefined,
  }),
  createFakeQuestionThemeDocument({
    label: createFakeLocalizedText({
      fr: "Musique",
      en: "Music",
    }),
    aliases: createFakeLocalizedTexts({
      fr: ["Chanson", "Musiques"],
      en: ["Songs", "Tunes"],
    }),
    description: createFakeLocalizedText({
      fr: "Thème lié à la musique, aux artistes et aux genres musicaux.",
      en: "Theme about music, artists and music genres.",
    }),
    status: "active",
    parentId: undefined,
  }),
  createFakeQuestionThemeDocument({
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
    status: "active",
    parentId: undefined,
  }),
  createFakeQuestionThemeDocument({
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
    parentId: undefined,
  }),
  createFakeQuestionThemeDocument({
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
    parentId: undefined,
  }),
] as const;

export { FIVE_QUESTION_THEMES_FIXTURE_SET };