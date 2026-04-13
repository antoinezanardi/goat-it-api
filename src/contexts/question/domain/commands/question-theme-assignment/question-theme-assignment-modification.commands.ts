import type { QuestionThemeAssignmentModificationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment-modification.contracts";

type QuestionThemeAssignmentModificationCommand = {
  questionId: string;
  themeId: string;
  payload: QuestionThemeAssignmentModificationContract;
};

export type {
  QuestionThemeAssignmentModificationCommand,
};