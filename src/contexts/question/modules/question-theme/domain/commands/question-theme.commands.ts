import type { QuestionThemeUpdateContract } from "@question/modules/question-theme/domain/contracts/question-theme.contracts";

type QuestionThemeUpdateCommand = {
  questionThemeId: string;
  payload: QuestionThemeUpdateContract;
};

export type {
  QuestionThemeUpdateCommand,
};