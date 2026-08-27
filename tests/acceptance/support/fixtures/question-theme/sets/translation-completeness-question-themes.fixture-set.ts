import { createFakeQuestionThemeDocument } from "@faketories/contexts/question-theme/mongoose/mongoose-document/question-theme.mongoose-document.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";
import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

const TRANSLATION_COMPLETENESS_QUESTION_THEMES_FULLY_TRANSLATED_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("5cd8edcc5fdf4cf6aaf79c9f"),
  slug: "fully-translated-theme",
  color: "#33A1FF",
  createdAt: new Date("2024-02-01T00:00:00.000Z"),
  updatedAt: new Date("2024-02-01T00:00:00.000Z"),
  label: createFakeLocalizedText({
    en: "Fully Translated Theme",
    fr: "Thème Entièrement Traduit",
    pt: "Tema Totalmente Traduzido",
    it: "Tema Completamente Tradotto",
    es: "Tema Completamente Traducido",
    de: "Vollständig Übersetztes Thema",
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Complete Theme"],
    fr: ["Thème Complet"],
    pt: ["Tema Completo"],
    it: ["Tema Completo"],
    es: ["Tema Completo"],
    de: ["Vollständiges Thema"],
  }),
  description: createFakeLocalizedText({
    en: "A theme with all locales set.",
    fr: "Un thème avec toutes les locales définies.",
    pt: "Um tema com todos os idiomas definidos.",
    it: "Un tema con tutte le località impostate.",
    es: "Un tema con todos los idiomas establecidos.",
    de: "Ein Thema mit allen Sprachen festgelegt.",
  }),
  status: "active",
});

const TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("3ff6c1e3ae2fe3fdd9ced1e9"),
  slug: "incomplete-theme",
  color: undefined,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  label: createFakeLocalizedText({
    en: "Incomplete Theme",
    fr: undefined,
    pt: undefined,
    it: undefined,
    es: undefined,
    de: undefined,
  }),
  aliases: createFakeLocalizedTexts({
    en: ["Partial Theme"],
    fr: undefined,
    pt: undefined,
    it: undefined,
    es: undefined,
    de: undefined,
  }),
  description: createFakeLocalizedText({
    en: "A theme missing most locales.",
    fr: undefined,
    pt: undefined,
    it: undefined,
    es: undefined,
    de: undefined,
  }),
  status: "active",
});

const TRANSLATION_COMPLETENESS_QUESTION_THEMES_FIXTURE_SET = [
  TRANSLATION_COMPLETENESS_QUESTION_THEMES_FULLY_TRANSLATED_ENTRY,
  TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_ENTRY,
] as const satisfies ReturnType<typeof createFakeQuestionThemeDocument>[];

export {
  TRANSLATION_COMPLETENESS_QUESTION_THEMES_FIXTURE_SET,
  TRANSLATION_COMPLETENESS_QUESTION_THEMES_FULLY_TRANSLATED_ENTRY,
  TRANSLATION_COMPLETENESS_QUESTION_THEMES_INCOMPLETE_ENTRY,
};