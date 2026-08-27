import { createFakeQuestionAuthorAggregate, createFakeQuestionContentAggregate } from "@faketories/contexts/question/aggregate/question.aggregate.faketory";
import { createFakeQuestionDocument, createFakeQuestionThemeAssignmentDocument } from "@faketories/contexts/question/mongoose/mongoose-document/question.mongoose-document.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import {
  TRANSLATION_COMPLETENESS_QUESTION_THEMES_FULLY_TRANSLATED_ENTRY,
  TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_ENTRY,
} from "@acceptance-support/fixtures/question-theme/sets/translation-completeness-question-themes.fixture-set";

const TRANSLATION_COMPLETENESS_QUESTIONS_FIXTURE_SET = [
  createFakeQuestionDocument({
    _id: createFakeObjectId("aa11bb22cc33dd44ee55ff02"),
    category: "trivia",
    createdAt: new Date("2024-02-01T00:00:00.000Z"),
    updatedAt: new Date("2024-02-01T00:00:00.000Z"),
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: TRANSLATION_COMPLETENESS_QUESTION_THEMES_FULLY_TRANSLATED_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "What is the capital of France?",
        fr: "Quelle est la capitale de la France?",
        pt: "Qual é a capital da França?",
        it: "Qual è la capitale della Francia?",
        es: "¿Cuál es la capital de Francia?",
        de: "Was ist die Hauptstadt von Frankreich?",
      }),
      answer: createFakeLocalizedText({
        en: "Paris",
        fr: "Paris",
        pt: "Paris",
        it: "Parigi",
        es: "París",
        de: "Paris",
      }),
      context: createFakeLocalizedText({
        en: "Paris is the largest city in France.",
        fr: "Paris est la plus grande ville de France.",
        pt: "Paris é a maior cidade da França.",
        it: "Parigi è la città più grande della Francia.",
        es: "París es la ciudad más grande de Francia.",
        de: "Paris ist die größte Stadt Frankreichs.",
      }),
      trivia: createFakeLocalizedTexts({
        en: ["Paris is known as the City of Light."],
        fr: ["Paris est connue comme la Ville Lumière."],
        pt: ["Paris é conhecida como a Cidade Luz."],
        it: ["Parigi è conosciuta come la Città della Luce."],
        es: ["París es conocida como la Ciudad de la Luz."],
        de: ["Paris ist als Stadt des Lichts bekannt."],
      }),
    }),
    cognitiveDifficulty: "easy",
    author: createFakeQuestionAuthorAggregate({
      role: "admin",
      name: "Test Author",
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/Paris"],
    status: "active",
  }),
  createFakeQuestionDocument({
    _id: createFakeObjectId("bb22cc33dd44ee55ff660103"),
    category: "riddle",
    createdAt: new Date("2024-01-15T00:00:00.000Z"),
    updatedAt: new Date("2024-01-15T00:00:00.000Z"),
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "What has keys but no locks?",
        fr: undefined,
        pt: undefined,
        it: undefined,
        es: undefined,
        de: undefined,
      }),
      answer: createFakeLocalizedText({
        en: "A piano",
        fr: undefined,
        pt: undefined,
        it: undefined,
        es: undefined,
        de: undefined,
      }),
      context: undefined,
      trivia: undefined,
    }),
    cognitiveDifficulty: "medium",
    author: createFakeQuestionAuthorAggregate({
      role: "ai",
      name: "Riddle AI",
    }),
    rejection: undefined,
    sourceUrls: ["https://example.com/riddle"],
    status: "active",
  }),
  createFakeQuestionDocument({
    _id: createFakeObjectId("cc33dd44ee55ff660104105a"),
    category: "explanation",
    createdAt: new Date("2024-01-20T00:00:00.000Z"),
    updatedAt: new Date("2024-01-20T00:00:00.000Z"),
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: TRANSLATION_COMPLETENESS_QUESTION_THEMES_FULLY_TRANSLATED_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "Explain gravity.",
        fr: "Expliquez la gravité.",
        pt: "Explique a gravidade.",
        it: "Spiega la gravità.",
        es: "Explica la gravedad.",
        de: "Erklären Sie die Schwerkraft.",
      }),
      answer: createFakeLocalizedText({
        en: "Gravity is a force of attraction.",
        fr: "La gravité est une force d'attraction.",
        pt: "A gravidade é uma força de atração.",
        it: "La gravità è una forza di attrazione.",
        es: "La gravedad es una fuerza de atracción.",
        de: "Die Schwerkraft ist eine Anziehungskraft.",
      }),
      context: undefined,
      trivia: undefined,
    }),
    cognitiveDifficulty: "hard",
    author: createFakeQuestionAuthorAggregate({
      role: "game",
      gameId: createFakeObjectId("ee55ff660102103300000000"),
      name: "Science Game",
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/Gravity"],
    status: "active",
  }),
  createFakeQuestionDocument({
    _id: createFakeObjectId("dd44ee55ff66010510610700"),
    category: "lexicon",
    createdAt: new Date("2024-01-25T00:00:00.000Z"),
    updatedAt: new Date("2024-01-25T00:00:00.000Z"),
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "What is the synonym of 'happy'?",
        fr: "Quel est le synonyme de 'heureux'?",
        pt: "Qual é o sinônimo de 'feliz'?",
        it: "Qual è il sinonimo di 'felice'?",
        es: "¿Cuál es el sinónimo de 'feliz'?",
        de: "Was ist das Synonym für 'glücklich'?",
      }),
      answer: createFakeLocalizedText({
        en: "Joyful",
        fr: "Joyeux",
        pt: "Alegre",
        it: "Gioioso",
        es: "Alegre",
        de: "Freudig",
      }),
      context: createFakeLocalizedText({
        en: "Synonyms are words with similar meanings.",
        fr: undefined,
        pt: undefined,
        it: undefined,
        es: undefined,
        de: undefined,
      }),
      trivia: undefined,
    }),
    cognitiveDifficulty: "easy",
    author: createFakeQuestionAuthorAggregate({
      role: "admin",
      name: "Lexicon Author",
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/Synonym"],
    status: "active",
  }),
] as const satisfies ReturnType<typeof createFakeQuestionDocument>[];

export { TRANSLATION_COMPLETENESS_QUESTIONS_FIXTURE_SET };