import type { QuestionCreationContract, QuestionModificationContract, QuestionThemeAssignmentCreationContract, QuestionThemeAssignmentModificationContract } from "@question/domain/types/question.contracts";

type QuestionCreationCommand = {
  payload: QuestionCreationContract;
};

type QuestionModificationCommand = {
  questionId: string;
  payload: QuestionModificationContract;
};

type QuestionThemeAssignmentCreationCommand = {
  questionId: string;
  payload: QuestionThemeAssignmentCreationContract;
};

type QuestionThemeAssignmentRemovalCommand = {
  questionId: string;
  themeId: string;
};

type QuestionThemeAssignmentModificationCommand = {
  questionId: string;
  themeId: string;
  payload: QuestionThemeAssignmentModificationContract;
};

export type {
  QuestionCreationCommand,
  QuestionModificationCommand,
  QuestionThemeAssignmentCreationCommand,
  QuestionThemeAssignmentRemovalCommand,
  QuestionThemeAssignmentModificationCommand,
};