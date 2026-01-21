import type { QuestionThemeAssignmentCreationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment.contracts";

type QuestionCreationContract = {
  themes: QuestionThemeAssignmentCreationContract[];
};

export type {
  QuestionCreationContract,
};