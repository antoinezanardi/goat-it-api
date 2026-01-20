import type { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

import type { TupleToUnion } from "type-fest";

type QuestionThemeStatus = TupleToUnion<typeof QUESTION_THEME_STATUSES>;

export type { QuestionThemeStatus };