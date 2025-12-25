import type { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question/modules/question-theme/domain/contracts/question-theme.contracts";

type QuestionThemeCreationCommand = {
  payload: QuestionThemeCreationContract;
};

type QuestionThemeModificationCommand = {
  questionThemeId: string;
  payload: QuestionThemeModificationContract;
};

export type {
  QuestionThemeCreationCommand,
  QuestionThemeModificationCommand,
};