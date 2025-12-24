import type { QuestionThemeModificationContract } from "@question/modules/question-theme/domain/contracts/question-theme.contracts";

type QuestionThemeModificationCommand = {
  questionThemeId: string;
  payload: QuestionThemeModificationContract;
};

export type {
  QuestionThemeModificationCommand,
};