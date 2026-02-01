import type { QUESTION_CREATION_STATUSES, QUESTION_STATUSES } from "@question/domain/value-objects/question-status/question-status.constants";

import type { TupleToUnion } from "type-fest";

import type { TupleToEnum } from "@shared/types/enum.types";

type QuestionStatus = TupleToUnion<typeof QUESTION_STATUSES>;

type QuestionStatusEnum = TupleToEnum<typeof QUESTION_STATUSES>;

type QuestionCreationStatus = TupleToUnion<typeof QUESTION_CREATION_STATUSES>;

export type {
  QuestionStatus,
  QuestionStatusEnum,
  QuestionCreationStatus,
};