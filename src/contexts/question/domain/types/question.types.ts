import type { ADMIN_QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question.constants";
import type { QuestionAuthorRole, QuestionCategory, QuestionCognitiveDifficulty, QuestionStatus } from "@question/domain/types/question.value-objects";

import type { TupleToUnion } from "type-fest";

type QuestionSortableField = TupleToUnion<typeof ADMIN_QUESTION_SORTABLE_FIELDS>;

type QuestionFilterOptions = {
  status: QuestionStatus;
  category: QuestionCategory;
  cognitiveDifficulty: QuestionCognitiveDifficulty;
  authorRole: QuestionAuthorRole;
  themeIds: string[];
};

type PublicQuestionFilterOptions = Omit<QuestionFilterOptions, "status">;

export type { QuestionSortableField, QuestionFilterOptions, PublicQuestionFilterOptions };