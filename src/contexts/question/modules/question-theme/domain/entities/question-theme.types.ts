import type { DEFAULT_QUESTION_THEME_STATUS } from "@question/modules/question-theme/domain/value-objects/question-theme-status.constants";

import type { QuestionThemeStatus } from "@question/modules/question-theme/domain/value-objects/question-theme-status.types";
import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

type QuestionTheme = {
  id: string;
  slug: string;
  label: LocalizedText;
  aliases: LocalizedTexts;
  description: LocalizedText;
  status: QuestionThemeStatus;
  createdAt: Date;
  updatedAt: Date;
};

type QuestionThemeDraft = Omit<QuestionTheme, "id" | "status" | "createdAt" | "updatedAt"> & {
  status: typeof DEFAULT_QUESTION_THEME_STATUS;
};

export type { QuestionTheme, QuestionThemeDraft };