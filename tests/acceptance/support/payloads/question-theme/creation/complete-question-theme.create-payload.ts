import { createFakeCreateQuestionThemeDto } from "@faketories/contexts/question/question-theme/question-theme.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

const COMPLETE_QUESTION_THEME_CREATION_PAYLOAD = Object.freeze(createFakeCreateQuestionThemeDto({
  slug: "general-knowledge",
  label: createFakeLocalizedText({
    en: "General knowledge",
    fr: "Culture générale",
    es: "Conocimiento general",
    pt: "Conhecimento geral",
    it: "Conoscenza generale",
    de: "Allgemeines Wissen",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Knowledge", "General"],
    fr: ["Connaissances", "Général"],
    es: ["Conocimiento", "General"],
    pt: ["Conhecimento", "Geral"],
    it: ["Conoscenza", "Generale"],
    de: ["Allgemeines Wissen", "Allgemein"],
  }),
  description: createFakeLocalizedText({
    en: "A theme that encompasses a wide range of general knowledge topics.",
    fr: "Un thème qui englobe une large gamme de sujets de culture générale.",
    es: "Un tema que abarca una amplia gama de temas de conocimiento general.",
    pt: "Um tema que abrange uma ampla gama de tópicos de conhecimento geral.",
    it: "Un tema che abbraccia una grande gamma di argomenti di conoscenza generale.",
    de: "Ein Thema, das eine breite Palette von allgemeinen Wissensthemen abdeckt.",
  }),
}));

export { COMPLETE_QUESTION_THEME_CREATION_PAYLOAD };