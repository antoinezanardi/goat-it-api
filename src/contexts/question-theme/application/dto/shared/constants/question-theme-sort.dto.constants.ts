import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { SortOrder } from "@shared/domain/types/sort/sort.types";

const QUESTION_THEME_SORT_BY_DESCRIPTION = "Field to sort question themes by";

const QUESTION_THEME_SORT_BY_DEFAULT = "slug" satisfies keyof QuestionTheme;

const QUESTION_THEME_SORT_ORDER_DEFAULT = "asc" satisfies SortOrder;

const QUESTION_THEME_SORT_ORDER_DESCRIPTION = "Sort order direction for question themes";

export { QUESTION_THEME_SORT_BY_DESCRIPTION, QUESTION_THEME_SORT_BY_DEFAULT, QUESTION_THEME_SORT_ORDER_DEFAULT, QUESTION_THEME_SORT_ORDER_DESCRIPTION };