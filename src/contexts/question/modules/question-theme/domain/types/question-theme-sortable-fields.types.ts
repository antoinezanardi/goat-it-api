import type { ADMIN_QUESTION_THEME_SORTABLE_FIELDS } from "@question/modules/question-theme/domain/constants/question-theme-sortable-fields.constants";

import type { TupleToUnion } from "type-fest";

type QuestionThemeSortableField = TupleToUnion<typeof ADMIN_QUESTION_THEME_SORTABLE_FIELDS>;

export type { QuestionThemeSortableField };