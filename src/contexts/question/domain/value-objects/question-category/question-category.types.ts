import type { QUESTION_CATEGORIES } from "@question/domain/value-objects/question-category/question-category.constants";

import type { TupleToUnion } from "type-fest";

import type { TupleToEnum } from "@shared/types/enum.types";

type QuestionCategory = TupleToUnion<typeof QUESTION_CATEGORIES>;

type QuestionCategoryEnum = TupleToEnum<typeof QUESTION_CATEGORIES>;

export type {
  QuestionCategory,
  QuestionCategoryEnum,
};