import type { Question } from "@question/domain/types/question.entities";

const QUESTION_SORT_BY_DESCRIPTION = "Field to sort questions by";

const QUESTION_SORT_BY_DEFAULT = "createdAt" as const satisfies keyof Question;

export { QUESTION_SORT_BY_DESCRIPTION, QUESTION_SORT_BY_DEFAULT };