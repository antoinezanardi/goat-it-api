import { createFakeQuestionAuthorAggregate, createFakeQuestionContentAggregate } from "@faketories/contexts/question/aggregate/question.aggregate.faketory";
import { createFakeQuestionDocument, createFakeQuestionThemeAssignmentDocument } from "@faketories/contexts/question/mongoose/mongoose-document/question.mongoose-document.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import { FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY } from "@acceptance-support/fixtures/question-theme/sets/five-question-themes.fixture-set";

import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

const OTHER_LOCALES_ARE_UNTRANSLATED = {
  en: undefined,
  fr: undefined,
  es: undefined,
  de: undefined,
  pt: undefined,
} as const;

const ENGLISH_LOCALES_ARE_UNTRANSLATED = {
  fr: undefined,
  es: undefined,
  de: undefined,
  it: undefined,
  pt: undefined,
} as const;

const FRENCH_LOCALES_ARE_UNTRANSLATED = {
  en: undefined,
  es: undefined,
  de: undefined,
  it: undefined,
  pt: undefined,
} as const;

function createItalianLocalizedText(italianText: string): LocalizedText {
  return createFakeLocalizedText({ ...OTHER_LOCALES_ARE_UNTRANSLATED, it: italianText });
}

function createItalianLocalizedTexts(italianTexts: string[]): LocalizedTexts {
  return createFakeLocalizedTexts({ ...OTHER_LOCALES_ARE_UNTRANSLATED, it: italianTexts });
}

function createEnglishLocalizedText(englishText: string): LocalizedText {
  return createFakeLocalizedText({ ...ENGLISH_LOCALES_ARE_UNTRANSLATED, en: englishText });
}

function createEnglishLocalizedTexts(englishTexts: string[]): LocalizedTexts {
  return createFakeLocalizedTexts({ ...ENGLISH_LOCALES_ARE_UNTRANSLATED, en: englishTexts });
}

function createFrenchLocalizedText(frenchText: string): LocalizedText {
  return createFakeLocalizedText({ ...FRENCH_LOCALES_ARE_UNTRANSLATED, fr: frenchText });
}

function createFrenchLocalizedTexts(frenchTexts: string[]): LocalizedTexts {
  return createFakeLocalizedTexts({ ...FRENCH_LOCALES_ARE_UNTRANSLATED, fr: frenchTexts });
}

const LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_ITALIAN_COMPLETE_ENTRY = createFakeQuestionDocument({
  _id: createFakeObjectId("aabbccdd1122334455667801"),
  applicableLocales: undefined,
  category: "trivia",
  status: "active",
  createdAt: new Date("2024-03-01T00:00:00.000Z"),
  updatedAt: new Date("2024-03-01T00:00:00.000Z"),
  themes: [
    createFakeQuestionThemeAssignmentDocument({
      themeId: FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
      isHint: false,
      isPrimary: true,
    }),
  ],
  content: createFakeQuestionContentAggregate({
    statement: createItalianLocalizedText("Quale regista ha diretto il film 'Vertigo' (1958)?"),
    answer: createItalianLocalizedText("Alfred Hitchcock"),
    context: createItalianLocalizedText("'Vertigo' è un film del 1958 diretto da Alfred Hitchcock."),
    trivia: createItalianLocalizedTexts(["Il film ha ricevuto due premi Oscar."]),
  }),
  cognitiveDifficulty: "easy",
  isAdultContent: false,
  author: createFakeQuestionAuthorAggregate({
    role: "admin",
    name: "Locale Completeness Test Author",
  }),
  rejection: undefined,
  sourceUrls: ["https://example.com/locale-completeness/italian-complete"],
});

const LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_CONTEXT_ENGLISH_ONLY_ENTRY = createFakeQuestionDocument({
  _id: createFakeObjectId("aabbccdd1122334455667802"),
  applicableLocales: undefined,
  category: "trivia",
  status: "active",
  createdAt: new Date("2024-03-02T00:00:00.000Z"),
  updatedAt: new Date("2024-03-02T00:00:00.000Z"),
  themes: [
    createFakeQuestionThemeAssignmentDocument({
      themeId: FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
      isHint: false,
      isPrimary: true,
    }),
  ],
  content: createFakeQuestionContentAggregate({
    statement: createItalianLocalizedText("Quale regista ha diretto il film 'Psycho' (1960)?"),
    answer: createItalianLocalizedText("Alfred Hitchcock"),
    context: createEnglishLocalizedText("'Psycho' is a 1960 film directed by Alfred Hitchcock."),
    trivia: createItalianLocalizedTexts(["Il film è stato girato in bianco e nero."]),
  }),
  cognitiveDifficulty: "easy",
  isAdultContent: false,
  author: createFakeQuestionAuthorAggregate({
    role: "admin",
    name: "Locale Completeness Test Author",
  }),
  rejection: undefined,
  sourceUrls: ["https://example.com/locale-completeness/context-english-only"],
});

const LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_OPTIONAL_FIELDS_ABSENT_ENTRY = createFakeQuestionDocument({
  _id: createFakeObjectId("aabbccdd1122334455667803"),
  applicableLocales: undefined,
  category: "trivia",
  status: "active",
  createdAt: new Date("2024-03-03T00:00:00.000Z"),
  updatedAt: new Date("2024-03-03T00:00:00.000Z"),
  themes: [
    createFakeQuestionThemeAssignmentDocument({
      themeId: FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
      isHint: false,
      isPrimary: true,
    }),
  ],
  content: createFakeQuestionContentAggregate({
    statement: createItalianLocalizedText("Quale regista ha diretto il film 'Rebecca' (1940)?"),
    answer: createItalianLocalizedText("Alfred Hitchcock"),
    context: undefined,
    trivia: undefined,
  }),
  cognitiveDifficulty: "easy",
  isAdultContent: false,
  author: createFakeQuestionAuthorAggregate({
    role: "admin",
    name: "Locale Completeness Test Author",
  }),
  rejection: undefined,
  sourceUrls: ["https://example.com/locale-completeness/optional-fields-absent"],
});

const LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_ENGLISH_ONLY_ENTRY = createFakeQuestionDocument({
  _id: createFakeObjectId("aabbccdd1122334455667804"),
  applicableLocales: undefined,
  category: "trivia",
  status: "active",
  createdAt: new Date("2024-03-04T00:00:00.000Z"),
  updatedAt: new Date("2024-03-04T00:00:00.000Z"),
  themes: [
    createFakeQuestionThemeAssignmentDocument({
      themeId: FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
      isHint: false,
      isPrimary: true,
    }),
  ],
  content: createFakeQuestionContentAggregate({
    statement: createEnglishLocalizedText("Which director made the film 'The Birds' (1963)?"),
    answer: createEnglishLocalizedText("Alfred Hitchcock"),
    context: createEnglishLocalizedText("'The Birds' is a 1963 film directed by Alfred Hitchcock."),
    trivia: createEnglishLocalizedTexts(["The film is loosely based on a short story."]),
  }),
  cognitiveDifficulty: "easy",
  isAdultContent: false,
  author: createFakeQuestionAuthorAggregate({
    role: "admin",
    name: "Locale Completeness Test Author",
  }),
  rejection: undefined,
  sourceUrls: ["https://example.com/locale-completeness/english-only"],
});

const LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_FRENCH_RESTRICTED_ENTRY = createFakeQuestionDocument({
  _id: createFakeObjectId("aabbccdd1122334455667805"),
  applicableLocales: ["fr"],
  category: "trivia",
  status: "active",
  createdAt: new Date("2024-03-05T00:00:00.000Z"),
  updatedAt: new Date("2024-03-05T00:00:00.000Z"),
  themes: [
    createFakeQuestionThemeAssignmentDocument({
      themeId: FIVE_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
      isHint: false,
      isPrimary: true,
    }),
  ],
  content: createFakeQuestionContentAggregate({
    statement: createFrenchLocalizedText("Quel réalisateur a dirigé le film 'Les Oiseaux' (1963) ?"),
    answer: createFrenchLocalizedText("Alfred Hitchcock"),
    context: createFrenchLocalizedText("'Les Oiseaux' est un film de 1963 réalisé par Alfred Hitchcock."),
    trivia: createFrenchLocalizedTexts(["Le film est librement inspiré d'une nouvelle."]),
  }),
  cognitiveDifficulty: "easy",
  isAdultContent: false,
  author: createFakeQuestionAuthorAggregate({
    role: "admin",
    name: "Locale Completeness Test Author",
  }),
  rejection: undefined,
  sourceUrls: ["https://example.com/locale-completeness/french-restricted"],
});

const LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_SET = [
  LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_ITALIAN_COMPLETE_ENTRY,
  LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_CONTEXT_ENGLISH_ONLY_ENTRY,
  LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_OPTIONAL_FIELDS_ABSENT_ENTRY,
  LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_ENGLISH_ONLY_ENTRY,
  LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_FRENCH_RESTRICTED_ENTRY,
] as const satisfies ReturnType<typeof createFakeQuestionDocument>[];

export {
  LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_SET,
  LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_ITALIAN_COMPLETE_ENTRY,
  LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_CONTEXT_ENGLISH_ONLY_ENTRY,
  LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_OPTIONAL_FIELDS_ABSENT_ENTRY,
  LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_ENGLISH_ONLY_ENTRY,
  LOCALE_COMPLETENESS_QUESTIONS_FIXTURE_FRENCH_RESTRICTED_ENTRY,
};