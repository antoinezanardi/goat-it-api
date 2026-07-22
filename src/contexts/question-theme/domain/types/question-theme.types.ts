import type { TupleToUnion } from "type-fest";
import type { ADMIN_QUESTION_THEME_SORTABLE_FIELDS } from "@question-theme/domain/constants/question-theme.constants";
import type { QuestionThemeStatus } from "@question-theme/domain/types/question-theme.value-objects";

type QuestionThemeSortableField = TupleToUnion<typeof ADMIN_QUESTION_THEME_SORTABLE_FIELDS>;

type AdminQuestionThemeFilterOptions = {
  status: QuestionThemeStatus;
};

type ThemeActiveQuestionCount = {
  themeId: string;
  themeSlug: string;
  activeQuestionCount: number;
};

type QuestionThemeStats = {
  total: number;
  byStatus: Record<QuestionThemeStatus, number>;
  byQuestionCount: ThemeActiveQuestionCount[];
};

export type {
  QuestionThemeSortableField,
  AdminQuestionThemeFilterOptions,
  ThemeActiveQuestionCount,
  QuestionThemeStats,
};