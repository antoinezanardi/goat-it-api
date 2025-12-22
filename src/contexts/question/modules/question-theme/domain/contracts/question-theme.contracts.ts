import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

type QuestionThemeUpdateContract = {
  slug?: string;
  label?: Partial<LocalizedText>;
  aliases?: Partial<LocalizedTexts>;
  description?: Partial<LocalizedText>;
};

export type {
  QuestionThemeUpdateContract,
};