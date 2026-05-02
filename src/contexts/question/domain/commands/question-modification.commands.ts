import type { QuestionModificationContract } from "@question/domain/contracts/question-modification/question-modification.contracts";

type QuestionModificationCommand = {
  questionId: string;
  payload: QuestionModificationContract;
};

export type {
  QuestionModificationCommand,
};