import type { ADMIN_QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question.constants";
import type { QuestionAuthorRole, QuestionCategory, QuestionCognitiveDifficulty, QuestionRejectionType, QuestionStatus } from "@question/domain/types/question.value-objects";

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

type FindRandomQuestionsOptions = {
  limit: number;
  excludedIds?: string[];
  categories?: QuestionCategory[];
  cognitiveDifficulties?: QuestionCognitiveDifficulty[];
  themeIds?: string[];
};

type QuestionStats = {
  total: number;
  byStatus: Partial<Record<QuestionStatus, number>>;
  byCategory: Partial<Record<QuestionCategory, number>>;
  byCognitiveDifficulty: Partial<Record<QuestionCognitiveDifficulty, number>>;
  byAuthorRole: Partial<Record<QuestionAuthorRole, number>>;
  byRejectionType: Partial<Record<QuestionRejectionType, number>>;
};

export type { QuestionSortableField, QuestionFilterOptions, PublicQuestionFilterOptions, FindRandomQuestionsOptions, QuestionStats };