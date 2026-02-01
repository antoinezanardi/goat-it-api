import { createFakeQuestionAuthorCreationDto } from "@faketories/contexts/question/dto/question-creation/question-author-creation/question-author-creation.dto.faketory";
import { createFakeQuestionContentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-content-creation/question-content-creation.dto.faketory";
import { createFakeQuestionCreationDto } from "@faketories/contexts/question/dto/question-creation/question-creation.dto.faketory";
import { createFakeQuestionThemeAssignmentCreationDto } from "@faketories/contexts/question/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import { FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY, FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY } from "@acceptance-support/fixtures/question-theme/sets/five-question-themes.fixture-set";

const COMPLETE_QUESTION_CREATION_PAYLOAD = Object.freeze(createFakeQuestionCreationDto({
  themes: [
    createFakeQuestionThemeAssignmentCreationDto({
      themeId: FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY._id.toString(),
      isPrimary: true,
      isHint: false,
    }),
    createFakeQuestionThemeAssignmentCreationDto({
      themeId: FIVE_QUESTION_THEMES_FIXTURE_HISTORY_ENTRY._id.toString(),
      isPrimary: false,
      isHint: true,
    }),
  ],
  content: createFakeQuestionContentCreationDto({
    statement: createFakeLocalizedText({
      en: "Who discovered penicillin?",
      fr: "Qui a découvert la pénicilline ?",
      es: "¿Quién descubrió la penicilina?",
      pt: "Quem descobriu a penicilina?",
      it: "Chi ha scoperto la penicillina?",
      de: "Wer entdeckte Penicillin?",
    }),
    answer: createFakeLocalizedText({
      en: "Alexander Fleming",
      fr: "Alexander Fleming",
      es: "Alexander Fleming",
      pt: "Alexander Fleming",
      it: "Alexander Fleming",
      de: "Alexander Fleming",
    }),
    context: createFakeLocalizedText({
      en: "In 1928 Alexander Fleming discovered penicillin, a breakthrough that led to modern antibiotics.",
      fr: "En 1928, Alexander Fleming a découvert la pénicilline, une percée qui a conduit aux antibiotiques modernes.",
      es: "En 1928 Alexander Fleming descubrió la penicilina, un avance que condujo a los antibióticos modernos.",
      pt: "Em 1928, Alexander Fleming descobriu a penicilina, uma descoberta que levou aos antibióticos modernos.",
      it: "Nel 1928 Alexander Fleming scoprì la penicillina, una scoperta che portò agli antibiotici moderni.",
      de: "1928 entdeckte Alexander Fleming das Penicillin, ein Durchbruch, der zu modernen Antibiotika führte.",
    }),
    trivia: createFakeLocalizedTexts({
      en: [
        "Alexander Fleming discovered penicillin in 1928.",
        "Fleming, Florey and Chain received the Nobel Prize in 1945 for their work on antibiotics.",
      ],
      fr: [
        "Alexander Fleming a découvert la pénicilline en 1928.",
        "Fleming, Florey et Chain ont reçu le prix Nobel en 1945 pour leurs travaux sur les antibiotiques.",
      ],
      es: [
        "Alexander Fleming descubrió la penicilina en 1928.",
        "Fleming, Florey y Chain recibieron el Premio Nobel en 1945 por su trabajo sobre antibióticos.",
      ],
      pt: [
        "Alexander Fleming descobriu a penicilina em 1928.",
        "Fleming, Florey e Chain receberam o Prêmio Nobel em 1945 por seu trabalho com antibióticos.",
      ],
      it: [
        "Alexander Fleming scoprì la penicillina nel 1928.",
        "Fleming, Florey e Chain ricevettero il Premio Nobel nel 1945 per il loro lavoro sugli antibiotici.",
      ],
      de: [
        "Alexander Fleming entdeckte 1928 das Penicillin.",
        "Fleming, Florey und Chain erhielten 1945 den Nobelpreis für ihre Arbeit an Antibiotika.",
      ],
    }),
  }),
  cognitiveDifficulty: "medium",
  author: createFakeQuestionAuthorCreationDto({
    role: "admin",
    name: "Antoine ZANARDI",
  }),
  sourceUrls: [
    "https://en.wikipedia.org/wiki/Penicillin",
    "https://www.nobelprize.org/prizes/medicine/1945/summary/",
  ],
}));

export { COMPLETE_QUESTION_CREATION_PAYLOAD };