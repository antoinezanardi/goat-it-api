import type { QuestionCreationContract } from "@question/domain/contracts/question.contracts";

type QuestionCreationCommand = {
  payload: QuestionCreationContract;
};

export type {
  QuestionCreationCommand,
};