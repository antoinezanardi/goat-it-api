import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

const DEFAULT_QUESTION_THEME_STATUS = "active";

const QUESTION_THEME_STATUS_ARCHIVED = "archived";

const QUESTION_THEME_STATUSES = [
  DEFAULT_QUESTION_THEME_STATUS,
  QUESTION_THEME_STATUS_ARCHIVED,
] as const satisfies readonly string[];

const ADMIN_QUESTION_THEME_SORTABLE_FIELDS = ["createdAt", "updatedAt", "slug", "status"] as const satisfies readonly (keyof QuestionTheme)[];

const QUESTION_THEME_SORTABLE_FIELDS = ["createdAt", "updatedAt", "slug"] as const satisfies readonly (keyof QuestionTheme)[];

export {
  ADMIN_QUESTION_THEME_SORTABLE_FIELDS,
  DEFAULT_QUESTION_THEME_STATUS,
  QUESTION_THEME_SORTABLE_FIELDS,
  QUESTION_THEME_STATUS_ARCHIVED,
  QUESTION_THEME_STATUSES,
};