import type { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question-theme/domain/repositories/question-theme.repository-contracts.types";

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