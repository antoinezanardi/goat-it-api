import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

type QuestionThemeModificationContract = {
  slug?: string;
  label?: Partial<LocalizedText>;
  aliases?: Partial<LocalizedTexts>;
  description?: Partial<LocalizedText>;
};

export type {
  QuestionThemeModificationContract,
};