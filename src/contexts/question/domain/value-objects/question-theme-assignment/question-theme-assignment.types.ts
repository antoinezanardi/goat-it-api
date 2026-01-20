import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

type QuestionThemeAssignment = {
  theme: QuestionTheme;
  isPrimary: boolean;
  isHint: boolean;
};

export type {
  QuestionThemeAssignment,
};