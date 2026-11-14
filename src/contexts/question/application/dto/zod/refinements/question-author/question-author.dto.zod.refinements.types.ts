import type { QuestionAuthorRole } from "@question/domain/types/question.value-objects";

type QuestionAuthorDtoZodRefinement = {
  role: QuestionAuthorRole;
  gameId?: string;
  name?: string;
};

export type {
  QuestionAuthorDtoZodRefinement,
};