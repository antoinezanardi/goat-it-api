import type { TupleToUnion } from "type-fest";
import type { ADMIN_QUESTION_THEME_SORTABLE_FIELDS } from "@question-theme/domain/constants/question-theme.constants";
import type { QuestionThemeStatus } from "@question-theme/domain/types/question-theme.value-objects";

type QuestionThemeSortableField = TupleToUnion<typeof ADMIN_QUESTION_THEME_SORTABLE_FIELDS>;

type AdminQuestionThemeFilterOptions = {
  status: QuestionThemeStatus;
};

export type { QuestionThemeSortableField, AdminQuestionThemeFilterOptions };