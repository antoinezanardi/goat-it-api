import type { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";

import type { TupleToUnion } from "type-fest";

type QuestionCognitiveDifficulty = TupleToUnion<typeof QUESTION_COGNITIVE_DIFFICULTIES>;

export type { QuestionCognitiveDifficulty };