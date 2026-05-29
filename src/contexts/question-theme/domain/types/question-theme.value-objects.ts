import type { QUESTION_THEME_STATUSES } from "@question-theme/domain/constants/question-theme.constants";
import type { TupleToUnion } from "type-fest";

import type { TupleToEnum } from "@shared/types/enum.types";

type QuestionThemeStatus = TupleToUnion<typeof QUESTION_THEME_STATUSES>;

type QuestionThemeStatusEnum = TupleToEnum<typeof QUESTION_THEME_STATUSES>;

export type {
  QuestionThemeStatus,
  QuestionThemeStatusEnum,
};