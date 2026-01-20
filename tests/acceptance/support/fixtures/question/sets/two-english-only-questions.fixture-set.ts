import { createFakeQuestionAuthorAggregate, createFakeQuestionContentAggregate } from "@faketories/contexts/question/aggregate/question.aggregate.faketory";
import { createFakeQuestionDocument, createFakeQuestionThemeAssignmentDocument } from "@faketories/contexts/question/mongoose-document/question.mongoose-document.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import { TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY, TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY } from "@acceptance-support/fixtures/question-theme/sets/two-english-only-question-themes.fixture-set";

const TWO_ENGLISH_ONLY_QUESTIONS_FIXTURE_SET = [
  createFakeQuestionDocument({
    _id: createFakeObjectId("aa11bb22cc33dd44ee55ff01"),
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_CINEMA_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "Which famous director made the film 'Vertigo' (1958)?",
        fr: undefined,
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
      answer: createFakeLocalizedText({
        en: "Alfred Hitchcock",
        fr: undefined,
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
      context: createFakeLocalizedText({
        en: "'Vertigo' is a 1958 film directed by Alfred Hitchcock and is widely regarded as one of his masterpieces.",
        fr: undefined,
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
      trivia: createFakeLocalizedTexts({
        en: ["The film's exploration of obsession and identity has made it a subject of much critical analysis."],
        fr: undefined,
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
    }),
    cognitiveDifficulty: "medium",
    author: createFakeQuestionAuthorAggregate({
      role: "admin",
      name: "Test Author",
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/Vertigo_(film)"],
    status: "active",
  }),
  createFakeQuestionDocument({
    _id: createFakeObjectId("bb22cc33dd44ee55ff660102"),
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: TWO_ENGLISH_ONLY_QUESTION_THEMES_FIXTURE_MUSIC_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "Which English rock band released the album 'The Dark Side of the Moon'?",
        fr: undefined,
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
      answer: createFakeLocalizedText({
        en: "Pink Floyd",
        fr: undefined,
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
      context: createFakeLocalizedText({
        en: "'The Dark Side of the Moon' is a 1973 album by Pink Floyd, notable for its sonic experimentation.",
        fr: undefined,
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
      trivia: createFakeLocalizedTexts({
        en: ["The album spent a record number of weeks on the Billboard charts."],
        fr: undefined,
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
    }),
    cognitiveDifficulty: "hard",
    author: createFakeQuestionAuthorAggregate({
      role: "ai",
      name: "Music AI",
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon"],
    status: "pending",
  }),
] as const satisfies ReturnType<typeof createFakeQuestionDocument>[];

export {
  TWO_ENGLISH_ONLY_QUESTIONS_FIXTURE_SET,
};