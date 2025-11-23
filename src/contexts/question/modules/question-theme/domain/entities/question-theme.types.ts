import type { QuestionThemeStatus } from "@question/modules/question-theme/domain/value-objects/question-theme-status.types";
import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

type QuestionTheme = {
  id: string;
  label: LocalizedText;
  aliases: LocalizedTexts;
  description: LocalizedText;
  parentId?: string;
  status: QuestionThemeStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type { QuestionTheme };