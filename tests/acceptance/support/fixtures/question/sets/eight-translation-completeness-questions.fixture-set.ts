import { createFakeQuestionAuthorAggregate, createFakeQuestionContentAggregate } from "@faketories/contexts/question/aggregate/question.aggregate.faketory";
import { createFakeQuestionDocument, createFakeQuestionThemeAssignmentDocument } from "@faketories/contexts/question/mongoose/mongoose-document/question.mongoose-document.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import {
  EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_FULLY_TRANSLATED_FIRST_ENTRY,
  EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_FULLY_TRANSLATED_SECOND_ENTRY,
  EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_FIRST_ENTRY,
  EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_SECOND_ENTRY,
  EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_THIRD_ENTRY,
  EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_FOURTH_ENTRY,
  EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_FIFTH_ENTRY,
  EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_SIXTH_ENTRY,
} from "@acceptance-support/fixtures/question-theme/sets/eight-translation-completeness-question-themes.fixture-set";

const EIGHT_TRANSLATION_COMPLETENESS_QUESTIONS_FIXTURE_SET = [
  // Question 1: Fully translated — Cooking theme
  createFakeQuestionDocument({
    _id: createFakeObjectId("a10000000000000000000001"),
    category: "trivia",
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_FULLY_TRANSLATED_FIRST_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "What is the main ingredient in traditional Italian pesto sauce?",
        fr: "Quel est l'ingrédient principal de la sauce pesto traditionnelle italienne?",
        it: "Qual è l'ingrediente principale del tradizionale pesto italiano?",
        pt: "Qual é o ingrediente principal do molho pesto tradicional italiano?",
        es: "¿Cuál es el ingrediente principal de la salsa pesto tradicional italiana?",
        de: "Was ist die Hauptzutat der traditionellen italienischen Pesto-Soße?",
      }),
      answer: createFakeLocalizedText({
        en: "Basil",
        fr: "Basilic",
        it: "Basilico",
        pt: "Manjericão",
        es: "Albahaca",
        de: "Basilikum",
      }),
      context: createFakeLocalizedText({
        en: "Traditional Italian pesto originates from Genoa and is made by crushing basil, pine nuts, garlic, Parmesan, Pecorino, and olive oil.",
        fr: "Le pesto italien traditionnel provient de Gêne et est préparé en écrasant du basilic, des pignons, de l'ail, du parmesan, du pecorino et de l'huile d'olive.",
        it: "Il pesto italiano tradizionale proviene da Genova ed è preparato macinando basilico, pinoli, aglio, parmigiano, pecorino e olio d'oliva.",
        pt: "O pesto italiano tradicional vem de Gênova e é feito triturando manjericão, pinhões, alho, parmesão, pecorino e azeite.",
        es: "El pesto italiano tradicional proviene de Génova y se hace triturando albahaca, piñones, ajo, parmesano, pecorino y aceite de oliva.",
        de: "Das traditionelle italienische Pesto stammt aus Genua und wird hergestellt, indem man Basilikum, Pinienkerne, Knoblauch, Parmesan, Pecorino und Olivenöl zerreibt.",
      }),
      trivia: createFakeLocalizedTexts({
        en: ["Pesto alla Genovese is protected by a DOP designation in the EU."],
        fr: ["Le pesto alla Genovese est protégé par une appellation DOP dans l'UE."],
        it: ["Il pesto alla Genovese è protetto da una denominazione DOP nell'UE."],
        pt: ["O pesto alla Genovese é protegido por uma designação DOP na UE."],
        es: ["El pesto alla Genovese está protegido por una denominación DOP en la UE."],
        de: ["Pesto alla Genovese wird in der EU durch eine DOP-Bezeichnung geschützt."],
      }),
    }),
    cognitiveDifficulty: "easy",
    author: createFakeQuestionAuthorAggregate({
      role: "admin",
      name: "Antoine ZANARDI",
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/Pesto"],
    status: "active",
    createdAt: new Date("2024-06-01T00:00:00.000Z"),
    updatedAt: new Date("2024-06-01T00:00:00.000Z"),
  }),

  // Question 2: Fully translated — Travel theme
  createFakeQuestionDocument({
    _id: createFakeObjectId("a20000000000000000000002"),
    category: "riddle",
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_FULLY_TRANSLATED_SECOND_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "Which city is known as the Eternal City?",
        fr: "Quelle ville est connue comme la Ville Éternelle?",
        it: "Quale città è conosciuta come la Città Eterna?",
        pt: "Qual cidade é conhecida como a Cidade Eterna?",
        es: "¿Qué ciudad es conocida como la Ciudad Eterna?",
        de: "Welche Stadt ist als Die Ewige Stadt bekannt?",
      }),
      answer: createFakeLocalizedText({
        en: "Rome",
        fr: "Rome",
        it: "Roma",
        pt: "Roma",
        es: "Roma",
        de: "Rom",
      }),
      context: createFakeLocalizedText({
        en: "Rome, the capital of Italy, has been called the Eternal City since ancient times due to its lasting significance.",
        fr: "Rome, capitale de l'Italie, est appelée la Ville Éternelle depuis l'Antiquité en raison de sa signification durable.",
        it: "Roma, capitale d'Italia, è chiamata la Città Eterna fin dall'antichità per la sua importanza duratura.",
        pt: "Roma, a capital da Itália, é chamada de Cidade Eterna desde a antiguidade devido à sua importância duradoura.",
        es: "Roma, la capital de Italia, es llamada la Ciudad Eterna desde la antigüedad debido a su importancia duradera.",
        de: "Rom, die Hauptstadt Italiens, wird seit der Antike als Die Ewige Stadt bezeichnet aufgrund seiner anhaltenden Bedeutung.",
      }),
    }),
    cognitiveDifficulty: "medium",
    author: createFakeQuestionAuthorAggregate({
      role: "ai",
      name: "Travel AI",
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/Rome"],
    status: "active",
    createdAt: new Date("2024-06-01T00:00:00.000Z"),
    updatedAt: new Date("2024-06-01T00:00:00.000Z"),
  }),

  // Question 3: Incomplete — Nature theme (English-only)
  createFakeQuestionDocument({
    _id: createFakeObjectId("a30000000000000000000003"),
    category: "explanation",
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_FIRST_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "What is the largest rainforest in the world?",
        fr: undefined,
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
      answer: createFakeLocalizedText({
        en: "The Amazon Rainforest",
        fr: undefined,
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
      context: createFakeLocalizedText({
        en: "The Amazon rainforest spans over 5.5 million square kilometers across nine countries in South America.",
        fr: undefined,
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
    }),
    cognitiveDifficulty: "easy",
    author: createFakeQuestionAuthorAggregate({
      role: "ai",
      name: "Nature AI",
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/Amazon_rainforest"],
    status: "active",
    createdAt: new Date("2024-06-01T00:00:00.000Z"),
    updatedAt: new Date("2024-06-01T00:00:00.000Z"),
  }),

  // Question 4: Incomplete — Music theme (en + fr only)
  createFakeQuestionDocument({
    _id: createFakeObjectId("a40000000000000000000004"),
    category: "trivia",
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_SECOND_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "Who composed the Four Seasons?",
        fr: "Qui a composé les Quatre Saisons?",
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
      answer: createFakeLocalizedText({
        en: "Antonio Vivaldi",
        fr: "Antonio Vivaldi",
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
      context: createFakeLocalizedText({
        en: "Antonio Vivaldi composed The Four Seasons around 1720, and it remains one of the most popular Baroque compositions.",
        fr: "Antonio Vivaldi a composé Les Quatre Saisons vers 1720, et cela reste l'une des compositions barques les plus populaires.",
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
      trivia: createFakeLocalizedTexts({
        en: ["Each of the four concerti represents a season of the year."],
        fr: ["Chacun des quatre concertos représente une saison de l'année."],
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
    }),
    cognitiveDifficulty: "medium",
    author: createFakeQuestionAuthorAggregate({
      role: "admin",
      name: "Antoine ZANARDI",
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/The_Four_Seasons_(Vivaldi)"],
    status: "active",
    createdAt: new Date("2024-06-01T00:00:00.000Z"),
    updatedAt: new Date("2024-06-01T00:00:00.000Z"),
  }),

  // Question 5: Incomplete — Technology theme (en + fr + it only)
  createFakeQuestionDocument({
    _id: createFakeObjectId("a50000000000000000000005"),
    category: "lexicon",
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_THIRD_ENTRY._id,
        isHint: true,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "What does HTML stand for?",
        fr: "Que signifie HTML?",
        it: "Cosa significa HTML?",
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
      answer: createFakeLocalizedText({
        en: "HyperText Markup Language",
        fr: "Langage de balisage hypertexte",
        it: "Linguaggio di markup ipertesto",
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
    }),
    cognitiveDifficulty: "easy",
    author: createFakeQuestionAuthorAggregate({
      role: "game",
      name: undefined,
      gameId: createFakeObjectId("32dafb5cfb677b53d1f7b61d"),
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/HTML"],
    status: "active",
    createdAt: new Date("2024-06-01T00:00:00.000Z"),
    updatedAt: new Date("2024-06-01T00:00:00.000Z"),
  }),

  // Question 6: Incomplete — Geography theme (en + fr + it + pt only)
  createFakeQuestionDocument({
    _id: createFakeObjectId("a60000000000000000000006"),
    category: "riddle",
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_FOURTH_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "Which is the longest river in Africa?",
        fr: "Quel est le plus long fleuve d'Afrique?",
        it: "Qual è il fiume più lungo dell'Africa?",
        pt: "Qual é o rio mais longo da África?",
        es: undefined,
        de: undefined,
      }),
      answer: createFakeLocalizedText({
        en: "The Nile",
        fr: "Le Nil",
        it: "Il Nilo",
        pt: "O Nilo",
        es: undefined,
        de: undefined,
      }),
      context: createFakeLocalizedText({
        en: "The Nile stretches approximately 6,650 kilometers through northeastern Africa.",
        fr: "Le Nil s'étend sur environ 6 650 kilomètres à travers le nord-est de l'Afrique.",
        it: "Il Nilo si estende per circa 6.650 chilometri attraverso il nord-est dell'Africa.",
        pt: "O Nilo se estende por aproximadamente 6.650 quilômetros pelo nordeste da África.",
        es: undefined,
        de: undefined,
      }),
    }),
    cognitiveDifficulty: "medium",
    author: createFakeQuestionAuthorAggregate({
      role: "ai",
      name: "Geography AI",
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/Nile"],
    status: "active",
    createdAt: new Date("2024-06-01T00:00:00.000Z"),
    updatedAt: new Date("2024-06-01T00:00:00.000Z"),
  }),

  // Question 7: Incomplete — Art theme (missing 'de' locale in statement)
  createFakeQuestionDocument({
    _id: createFakeObjectId("a70000000000000000000007"),
    category: "explanation",
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_FIFTH_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "Who painted the Mona Lisa?",
        fr: "Qui a peint la Joconde?",
        it: "Chi ha dipinto la Gioconda?",
        pt: "Quem pintou a Mona Lisa?",
        es: "¿Quién pintó la Mona Lisa?",
        de: undefined,
      }),
      answer: createFakeLocalizedText({
        en: "Leonardo da Vinci",
        fr: "Léonard de Vinci",
        it: "Leonardo da Vinci",
        pt: "Leonardo da Vinci",
        es: "Leonardo da Vinci",
        de: "Leonardo da Vinci",
      }),
      context: createFakeLocalizedText({
        en: "The Mona Lisa was painted by Leonardo da Vinci in the early 16th century and hangs in the Louvre Museum in Paris.",
        fr: undefined,
        it: undefined,
        pt: undefined,
        es: undefined,
        de: undefined,
      }),
    }),
    cognitiveDifficulty: "easy",
    author: createFakeQuestionAuthorAggregate({
      role: "admin",
      name: "Antoine ZANARDI",
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/Mona_Lisa"],
    status: "active",
    createdAt: new Date("2024-06-01T00:00:00.000Z"),
    updatedAt: new Date("2024-06-01T00:00:00.000Z"),
  }),

  // Question 8: Incomplete — Literature theme (en + it + es only)
  createFakeQuestionDocument({
    _id: createFakeObjectId("a80000000000000000000008"),
    category: "trivia",
    themes: [
      createFakeQuestionThemeAssignmentDocument({
        themeId: EIGHT_TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_SIXTH_ENTRY._id,
        isHint: false,
        isPrimary: true,
      }),
    ],
    content: createFakeQuestionContentAggregate({
      statement: createFakeLocalizedText({
        en: "Who wrote 'One Hundred Years of Solitude'?",
        fr: undefined,
        it: "Chi ha scritto 'Cent'anni di solitudine'?",
        pt: undefined,
        es: "¿Quién escribió 'Cien años de soledad'?",
        de: undefined,
      }),
      answer: createFakeLocalizedText({
        en: "Gabriel García Márquez",
        fr: undefined,
        it: "Gabriel García Márquez",
        pt: undefined,
        es: "Gabriel García Márquez",
        de: undefined,
      }),
      context: createFakeLocalizedText({
        en: "Gabriel García Márquez published this masterpiece of magical realism in 1967.",
        fr: undefined,
        it: "Gabriel García Márquez ha pubblicato questo capolavoro del realismo magico nel 1967.",
        pt: undefined,
        es: "Gabriel García Márquez publicó esta obra maestra del realismo mágico en 1967.",
        de: undefined,
      }),
      trivia: createFakeLocalizedTexts({
        en: ["The novel has been translated into over 40 languages."],
        fr: undefined,
        it: ["Il romanzo è stato tradotto in oltre 40 lingue."],
        pt: undefined,
        es: ["La novela ha sido traducida a más de 40 idiomas."],
        de: undefined,
      }),
    }),
    cognitiveDifficulty: "hard",
    author: createFakeQuestionAuthorAggregate({
      role: "ai",
      name: "Literature AI",
    }),
    rejection: undefined,
    sourceUrls: ["https://en.wikipedia.org/wiki/One_Hundred_Years_of_Solitude"],
    status: "active",
    createdAt: new Date("2024-06-01T00:00:00.000Z"),
    updatedAt: new Date("2024-06-01T00:00:00.000Z"),
  }),
] as const satisfies ReturnType<typeof createFakeQuestionDocument>[];

export {
  EIGHT_TRANSLATION_COMPLETENESS_QUESTIONS_FIXTURE_SET,
};