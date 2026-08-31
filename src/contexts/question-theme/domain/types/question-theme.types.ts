import type { TupleToUnion } from "type-fest";
import type { ADMIN_QUESTION_THEME_SORTABLE_FIELDS } from "@question-theme/domain/constants/question-theme.constants";
import type { QuestionThemeStatus } from "@question-theme/domain/types/question-theme.value-objects";

import type { TranslationCompletenessStats } from "@shared/domain/types/translation-completeness/translation-completeness.types";

type QuestionThemeSortableField = TupleToUnion<typeof ADMIN_QUESTION_THEME_SORTABLE_FIELDS>;

type AdminQuestionThemeFilterOptions = {
  status: QuestionThemeStatus;
  isFullyTranslated: boolean;
};

type QuestionThemeActiveQuestionStatsCount = {
  themeId: string;
  themeSlug: string;
  activeQuestionCount: number;
};

type QuestionThemeStats = {
  total: number;
  byStatus: Partial<Record<QuestionThemeStatus, number>>;
  byQuestionCount: QuestionThemeActiveQuestionStatsCount[];
  byTranslationCompleteness: TranslationCompletenessStats;
};

export type {
  QuestionThemeSortableField,
  AdminQuestionThemeFilterOptions,
  QuestionThemeActiveQuestionStatsCount,
  QuestionThemeStats,
};