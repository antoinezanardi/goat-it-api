import type { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question-theme/domain/types/question-theme.contracts";

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