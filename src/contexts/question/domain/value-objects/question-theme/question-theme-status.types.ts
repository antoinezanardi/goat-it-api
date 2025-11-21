import type { QUESTION_THEME_STATUSES } from "@question/domain/value-objects/question-theme/question-theme-status.constants";

import type { TupleToUnion } from "type-fest";

type QuestionThemeStatus = TupleToUnion<typeof QUESTION_THEME_STATUSES>;

export type { QuestionThemeStatus };