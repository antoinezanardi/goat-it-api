import type { QUESTION_AUTHOR_ROLES } from "@question/domain/value-objects/question-author/question-author.constants";

import type { TupleToUnion } from "type-fest";

type QuestionAuthorRole = TupleToUnion<typeof QUESTION_AUTHOR_ROLES>;

type QuestionAuthor = {
  type: QuestionAuthorRole;
  gameId?: string;
  name?: string;
};

export type {
  QuestionAuthorRole,
  QuestionAuthor,
};