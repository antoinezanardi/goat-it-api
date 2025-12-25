import type { QuestionThemeStatus } from "@question/modules/question-theme/domain/value-objects/question-theme-status.types";
import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

type QuestionTheme = {
  id: string;
  slug: string;
  label: Partial<LocalizedText>;
  aliases: Partial<LocalizedTexts>;
  description: Partial<LocalizedText>;
  status: QuestionThemeStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type {
  QuestionTheme,
};