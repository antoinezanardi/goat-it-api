import { QUESTION_COGNITIVE_DIFFICULTY_SORT_ORDER, QUESTION_STATUS_SORT_ORDER } from "@question/domain/constants/question.constants";

import type { TranslationCompletenessFieldSpec } from "@shared/infrastructure/persistence/mongoose/types/translation-completeness.mongoose.types";
import type { SemanticSortOrders } from "@shared/infrastructure/persistence/mongoose/types/mongoose.types";
import type { QuestionSortableField } from "@question/domain/types/question.types";

const QUESTION_MONGOOSE_COLLECTION_NAME = "questions";

const QUESTION_TRANSLATION_COMPLETENESS_FIELD_SPECS: TranslationCompletenessFieldSpec[] = [
  { path: "content.statement", isMandatory: true },
  { path: "content.answer", isMandatory: true },
  { path: "content.context", isMandatory: false },
  { path: "content.trivia", isMandatory: false },
];

const QUESTION_SEMANTIC_SORT_ORDERS: SemanticSortOrders<QuestionSortableField> = {
  cognitiveDifficulty: QUESTION_COGNITIVE_DIFFICULTY_SORT_ORDER,
  status: QUESTION_STATUS_SORT_ORDER,
};

export { QUESTION_MONGOOSE_COLLECTION_NAME, QUESTION_SEMANTIC_SORT_ORDERS, QUESTION_TRANSLATION_COMPLETENESS_FIELD_SPECS };