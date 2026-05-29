import type { Question } from "@question/domain/entities/question.types";

const ADMIN_QUESTION_SORTABLE_FIELDS = ["createdAt", "updatedAt", "category", "cognitiveDifficulty", "status"] as const satisfies readonly (keyof Question)[];

const QUESTION_SORTABLE_FIELDS = ["createdAt", "updatedAt", "category", "cognitiveDifficulty"] as const satisfies readonly (keyof Question)[];

export { ADMIN_QUESTION_SORTABLE_FIELDS, QUESTION_SORTABLE_FIELDS };