import { createFakeQuestionAuthorAggregate, createFakeQuestionContentAggregate } from "@faketories/contexts/question/aggregate/question.aggregate.faketory";
import { createFakeQuestionDocument, createFakeQuestionThemeAssignmentDocument } from "@faketories/contexts/question/mongoose/mongoose-document/question.mongoose-document.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import { FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY } from "@acceptance-support/fixtures/question-theme/sets/five-question-themes.fixture-set";

const APPLICABLE_LOCALES_QUESTIONS_FIXTURE_ABSENT_ENTRY = createFakeQuestionDocument({
  _id: createFakeObjectId("aabbccdd1122334455667701"),
  applicableLocales: undefined,
  category: "trivia",
  status: "active",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  themes: [
    createFakeQuestionThemeAssignmentDocument({
      themeId: FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
      isHint: false,
      isPrimary: true,
    }),
  ],
  content: createFakeQuestionContentAggregate({
    statement: createFakeLocalizedText({
      en: "Absent applicableLocales question statement.",
      fr: "Énoncé de question sans applicableLocales.",
    }),
    answer: createFakeLocalizedText({
      en: "Absent answer.",
      fr: "Réponse sans applicableLocales.",
    }),
    context: createFakeLocalizedText({
      en: "Absent context.",
      fr: "Contexte sans applicableLocales.",
    }),
    trivia: createFakeLocalizedTexts({
      en: ["Absent trivia."],
      fr: ["Trivia sans applicableLocales."],
    }),
  }),
  cognitiveDifficulty: "easy",
  author: createFakeQuestionAuthorAggregate({
    role: "admin",
    name: "Locale Test Author",
  }),
  rejection: undefined,
  sourceUrls: ["https://example.com/absent"],
});

const APPLICABLE_LOCALES_QUESTIONS_FIXTURE_EMPTY_ENTRY = createFakeQuestionDocument({
  _id: createFakeObjectId("aabbccdd1122334455667702"),
  applicableLocales: [],
  category: "trivia",
  status: "active",
  createdAt: new Date("2024-01-02T00:00:00.000Z"),
  updatedAt: new Date("2024-01-02T00:00:00.000Z"),
  themes: [
    createFakeQuestionThemeAssignmentDocument({
      themeId: FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
      isHint: false,
      isPrimary: true,
    }),
  ],
  content: createFakeQuestionContentAggregate({
    statement: createFakeLocalizedText({
      en: "Empty applicableLocales question statement.",
      fr: "Énoncé de question avec applicableLocales vide.",
    }),
    answer: createFakeLocalizedText({
      en: "Empty answer.",
      fr: "Réponse avec applicableLocales vide.",
    }),
    context: createFakeLocalizedText({
      en: "Empty context.",
      fr: "Contexte avec applicableLocales vide.",
    }),
    trivia: createFakeLocalizedTexts({
      en: ["Empty trivia."],
      fr: ["Trivia avec applicableLocales vide."],
    }),
  }),
  cognitiveDifficulty: "easy",
  author: createFakeQuestionAuthorAggregate({
    role: "admin",
    name: "Locale Test Author",
  }),
  rejection: undefined,
  sourceUrls: ["https://example.com/empty"],
});

const APPLICABLE_LOCALES_QUESTIONS_FIXTURE_FRENCH_ONLY_ENTRY = createFakeQuestionDocument({
  _id: createFakeObjectId("aabbccdd1122334455667703"),
  applicableLocales: ["fr"],
  category: "trivia",
  status: "active",
  createdAt: new Date("2024-01-03T00:00:00.000Z"),
  updatedAt: new Date("2024-01-03T00:00:00.000Z"),
  themes: [
    createFakeQuestionThemeAssignmentDocument({
      themeId: FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
      isHint: false,
      isPrimary: true,
    }),
  ],
  content: createFakeQuestionContentAggregate({
    statement: createFakeLocalizedText({
      en: "French only question statement.",
      fr: "Énoncé de question en français uniquement.",
    }),
    answer: createFakeLocalizedText({
      en: "French only answer.",
      fr: "Réponse en français uniquement.",
    }),
    context: createFakeLocalizedText({
      en: "French only context.",
      fr: "Contexte en français uniquement.",
    }),
    trivia: createFakeLocalizedTexts({
      en: ["French only trivia."],
      fr: ["Trivia en français uniquement."],
    }),
  }),
  cognitiveDifficulty: "easy",
  author: createFakeQuestionAuthorAggregate({
    role: "admin",
    name: "Locale Test Author",
  }),
  rejection: undefined,
  sourceUrls: ["https://example.com/french-only"],
});

const APPLICABLE_LOCALES_QUESTIONS_FIXTURE_ENGLISH_AND_FRENCH_ENTRY = createFakeQuestionDocument({
  _id: createFakeObjectId("aabbccdd1122334455667704"),
  applicableLocales: ["en", "fr"],
  category: "trivia",
  status: "active",
  createdAt: new Date("2024-01-04T00:00:00.000Z"),
  updatedAt: new Date("2024-01-04T00:00:00.000Z"),
  themes: [
    createFakeQuestionThemeAssignmentDocument({
      themeId: FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
      isHint: false,
      isPrimary: true,
    }),
  ],
  content: createFakeQuestionContentAggregate({
    statement: createFakeLocalizedText({
      en: "English and French question statement.",
      fr: "Énoncé de question en anglais et français.",
    }),
    answer: createFakeLocalizedText({
      en: "English and French answer.",
      fr: "Réponse en anglais et français.",
    }),
    context: createFakeLocalizedText({
      en: "English and French context.",
      fr: "Contexte en anglais et français.",
    }),
    trivia: createFakeLocalizedTexts({
      en: ["English and French trivia."],
      fr: ["Trivia en anglais et français."],
    }),
  }),
  cognitiveDifficulty: "easy",
  author: createFakeQuestionAuthorAggregate({
    role: "admin",
    name: "Locale Test Author",
  }),
  rejection: undefined,
  sourceUrls: ["https://example.com/en-fr"],
});

const APPLICABLE_LOCALES_QUESTIONS_FIXTURE_SET = [
  APPLICABLE_LOCALES_QUESTIONS_FIXTURE_ABSENT_ENTRY,
  APPLICABLE_LOCALES_QUESTIONS_FIXTURE_EMPTY_ENTRY,
  APPLICABLE_LOCALES_QUESTIONS_FIXTURE_FRENCH_ONLY_ENTRY,
  APPLICABLE_LOCALES_QUESTIONS_FIXTURE_ENGLISH_AND_FRENCH_ENTRY,
] as const satisfies ReturnType<typeof createFakeQuestionDocument>[];

export {
  APPLICABLE_LOCALES_QUESTIONS_FIXTURE_SET,
  APPLICABLE_LOCALES_QUESTIONS_FIXTURE_ABSENT_ENTRY,
  APPLICABLE_LOCALES_QUESTIONS_FIXTURE_EMPTY_ENTRY,
  APPLICABLE_LOCALES_QUESTIONS_FIXTURE_FRENCH_ONLY_ENTRY,
  APPLICABLE_LOCALES_QUESTIONS_FIXTURE_ENGLISH_AND_FRENCH_ENTRY,
};