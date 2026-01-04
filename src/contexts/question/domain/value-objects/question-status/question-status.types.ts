import type { QUESTION_STATUSES } from "@question/domain/value-objects/question-status/question-status.constants";

import type { TupleToUnion } from "type-fest";

type QuestionStatus = TupleToUnion<typeof QUESTION_STATUSES>;

export type { QuestionStatus };