import type { QuestionThemeAssignmentCreationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment.contracts";

type QuestionThemeAssignmentCreationCommand = {
  questionId: string;
  payload: QuestionThemeAssignmentCreationContract;
};

type QuestionThemeAssignmentRemovalCommand = {
  questionId: string;
  themeId: string;
};

export type {
  QuestionThemeAssignmentCreationCommand,
  QuestionThemeAssignmentRemovalCommand,
};