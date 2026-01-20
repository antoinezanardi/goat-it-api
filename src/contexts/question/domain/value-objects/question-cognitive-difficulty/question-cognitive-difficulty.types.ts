import type { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";

import type { TupleToUnion } from "type-fest";

import type { TupleToEnum } from "@shared/types/enum.types";

type QuestionCognitiveDifficulty = TupleToUnion<typeof QUESTION_COGNITIVE_DIFFICULTIES>;

type QuestionCognitiveDifficultyEnum = TupleToEnum<typeof QUESTION_COGNITIVE_DIFFICULTIES>;

export type {
  QuestionCognitiveDifficulty,
  QuestionCognitiveDifficultyEnum,
};