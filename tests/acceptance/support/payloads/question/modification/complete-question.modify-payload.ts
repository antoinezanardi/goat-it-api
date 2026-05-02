import { createFakeQuestionContentModificationDto, createFakeQuestionModificationDto } from "@faketories/contexts/question/dto/question-modification/question-modification.dto.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

const COMPLETE_QUESTION_MODIFICATION_PAYLOAD = Object.freeze(createFakeQuestionModificationDto({
  category: "trivia",
  cognitiveDifficulty: "hard",
  sourceUrls: [
    "https://en.wikipedia.org/wiki/Psycho_(1960_film)",
    "https://www.imdb.com/title/tt0054215/",
  ],
  content: createFakeQuestionContentModificationDto({
    statement: createFakeLocalizedText({
      en: "Which director created the iconic horror film 'Psycho' in 1960?",
      fr: "Quel réalisateur a créé le film d'horreur iconique 'Psychose' en 1960?",
      it: undefined,
      es: undefined,
      de: undefined,
      pt: undefined,
    }),
    answer: createFakeLocalizedText({
      en: "Sir Alfred Hitchcock",
      fr: "Sir Alfred Hitchcock",
      it: undefined,
      es: undefined,
      de: undefined,
      pt: undefined,
    }),
    context: createFakeLocalizedText({
      en: "Alfred Hitchcock, known as the 'Master of Suspense', directed 'Psycho' in 1960, revolutionizing the horror genre.",
      fr: "Alfred Hitchcock, connu comme le 'Maître du Suspense', a réalisé 'Psychose' en 1960, révolutionnant le genre horrifique.",
      it: undefined,
      es: undefined,
      de: undefined,
      pt: undefined,
    }),
    trivia: createFakeLocalizedTexts({
      en: [
        "The shower scene in Psycho took 7 days to shoot and features 70 camera angles.",
        "Hitchcock bought as many copies of the source novel as possible to keep the ending a secret.",
      ],
      fr: [
        "La scène de douche dans Psychose a nécessité 7 jours de tournage et 70 angles de caméra.",
        "Hitchcock a acheté autant d'exemplaires du roman source que possible pour garder la fin secrète.",
      ],
      it: undefined,
      es: undefined,
      de: undefined,
      pt: undefined,
    }),
  }),
}));

export { COMPLETE_QUESTION_MODIFICATION_PAYLOAD };