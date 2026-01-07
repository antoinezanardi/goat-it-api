import type { QUESTION_REJECTION_TYPES } from "@question/domain/value-objects/question-rejection/question-rejection.constants";

import type { TupleToUnion } from "type-fest";

type QuestionRejectionType = TupleToUnion<typeof QUESTION_REJECTION_TYPES>;

type QuestionRejection = {
  type: QuestionRejectionType;
  comment?: string;
};

export type {
  QuestionRejectionType,
  QuestionRejection,
};