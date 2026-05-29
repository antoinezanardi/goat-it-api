import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

const QUESTION_THEME_SORT_BY_DESCRIPTION = "Field to sort question themes by";

const QUESTION_THEME_SORT_BY_DEFAULT = "createdAt" as const satisfies keyof QuestionTheme;

export { QUESTION_THEME_SORT_BY_DESCRIPTION, QUESTION_THEME_SORT_BY_DEFAULT };