import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

const QUESTION_THEME_SORT_BY_DESCRIPTION = "Field to sort question themes by";

const QUESTION_THEME_SORT_BY_DEFAULT = "createdAt" as const satisfies keyof QuestionTheme;

export { QUESTION_THEME_SORT_BY_DESCRIPTION, QUESTION_THEME_SORT_BY_DEFAULT };