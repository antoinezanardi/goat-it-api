import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

const ADMIN_QUESTION_THEME_SORTABLE_FIELDS = ["createdAt", "updatedAt", "slug", "status"] as const satisfies readonly (keyof QuestionTheme)[];

const QUESTION_THEME_SORTABLE_FIELDS = ["createdAt", "updatedAt", "slug"] as const satisfies readonly (keyof QuestionTheme)[];

export { ADMIN_QUESTION_THEME_SORTABLE_FIELDS, QUESTION_THEME_SORTABLE_FIELDS };