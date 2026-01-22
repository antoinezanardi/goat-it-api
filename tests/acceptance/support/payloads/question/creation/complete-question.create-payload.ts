import { createFakeQuestionAuthorCreationDto } from "@faketories/contexts/question/dto/question-creation/question-author-creation/question-author-creation.dto.faketory";
import { createFakeQuestionContentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-content-creation/question-content-creation.dto.faketory";
import { createFakeQuestionCreationDto } from "@faketories/contexts/question/dto/question-creation/question-creation.dto.faketory";
import { createFakeQuestionThemeAssignmentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import { FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY } from "@acceptance-support/fixtures/question-theme/sets/five-question-themes.fixture-set";

const COMPLETE_QUESTION_CREATION_PAYLOAD = Object.freeze(createFakeQuestionCreationDto({
  themes: [
    createFakeQuestionThemeAssignmentCreationDto({
      themeId: FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY._id.toString(),
      isPrimary: true,
      isHint: false,
    }),
  ],
  content: createFakeQuestionContentCreationDto({
    statement: createFakeLocalizedText({
      en: "Which planet in our solar system is known as the Red Planet?",
      fr: "Quelle planète de notre système solaire est connue sous le nom de planète rouge ?",
      es: "¿Qué planeta de nuestro sistema solar es conocido como el Planeta Rojo?",
      pt: "Qual planeta do nosso sistema solar é conhecido como o Planeta Vermelho?",
      it: "Quale pianeta del nostro sistema solare è conosciuto come il Pianeta Rosso?",
      de: "Welcher Planet in unserem Sonnensystem ist als der Rote Planet bekannt?",
    }),
    answer: createFakeLocalizedText({
      en: "Mars",
      fr: "Mars",
      es: "Marte",
      pt: "Marte",
      it: "Marte",
      de: "Mars",
    }),
    context: createFakeLocalizedText({
      en: "Basic astronomy — planets and their nicknames.",
      fr: "Astronomie de base — planètes et leurs surnoms.",
      es: "Astronomía básica: planetas y sus apodos.",
      pt: "Astronomia básica — planetas e seus apelidos.",
      it: "Astronomia di base: pianeti e i loro soprannomi.",
      de: "Grundlegende Astronomie — Planeten und ihre Spitznamen.",
    }),
    trivia: createFakeLocalizedTexts({
      en: [
        "Mars appears red because of iron oxide (rust) on its surface.",
        "It has the largest volcano in the solar system, Olympus Mons.",
      ],
      fr: [
        "Mars semble rouge à cause de l'oxyde de fer à sa surface.",
        "Elle possède le plus grand volcan du système solaire, Olympus Mons.",
      ],
      es: [
        "Marte parece rojo debido al óxido de hierro en su superficie.",
        "Tiene el volcán más grande del sistema solar, Olympus Mons.",
      ],
      pt: [
        "Marte parece vermelho por causa do óxido de ferro em sua superfície.",
        "Possui o maior vulcão do sistema solar, Olympus Mons.",
      ],
      it: [
        "Marte appare rosso a causa dell'ossido di ferro sulla sua superficie.",
        "Ha il vulcano più grande del sistema solare, Olympus Mons.",
      ],
      de: [
        "Mars erscheint rot wegen Eisenoxid auf seiner Oberfläche.",
        "Er hat den größten Vulkan im Sonnensystem, Olympus Mons.",
      ],
    }),
  }),
  cognitiveDifficulty: "easy",
  author: createFakeQuestionAuthorCreationDto({
    role: "admin",
    name: "Antoine ZANARDI",
  }),
  sourceUrls: [
    "https://solarsystem.nasa.gov/planets/mars/overview/",
    "https://en.wikipedia.org/wiki/Mars",
  ],
}));

export { COMPLETE_QUESTION_CREATION_PAYLOAD };