import type { QuestionCreationAuthorRole } from "@question/domain/value-objects/question-author/question-author.types";

type QuestionAuthorCreationContract = {
  role: QuestionCreationAuthorRole;
  name: string;
};

export type {
  QuestionAuthorCreationContract,
};