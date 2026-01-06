import type { QUESTION_AUTHOR_ROLES } from "@question/domain/value-objects/question-author/question-author.constants";

import type { TupleToUnion } from "type-fest";

type QuestionAuthorRole = TupleToUnion<typeof QUESTION_AUTHOR_ROLES>;

type BaseQuestionAuthor<T extends QuestionAuthorRole> = {
  type: T;
  name?: string;
};

type QuestionGameAuthor = BaseQuestionAuthor<"game"> & {
  gameId: string;
};

type QuestionAIAuthor = BaseQuestionAuthor<"ai">;

type QuestionAdminAuthor = BaseQuestionAuthor<"admin">;

type QuestionAuthor =
  | QuestionGameAuthor
  | QuestionAIAuthor
  | QuestionAdminAuthor;

export type {
  QuestionAuthorRole,
  QuestionAuthor,
};