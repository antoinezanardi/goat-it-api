import type { ADMIN_QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question-sortable-fields.constants";

import type { TupleToUnion } from "type-fest";

type QuestionSortableField = TupleToUnion<typeof ADMIN_QUESTION_SORTABLE_FIELDS>;

export type { QuestionSortableField };