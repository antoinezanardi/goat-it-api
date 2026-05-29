import { QUESTION_COGNITIVE_DIFFICULTY_SORT_ORDER, QUESTION_STATUS_SORT_ORDER } from "@question/domain/constants/question.constants";

import type { SemanticSortOrders } from "@shared/infrastructure/persistence/mongoose/types/mongoose.types";
import type { QuestionSortableField } from "@question/domain/types/question.types";

const QUESTION_MONGOOSE_COLLECTION_NAME = "questions";

const QUESTION_SEMANTIC_SORT_ORDERS: SemanticSortOrders<QuestionSortableField> = {
  cognitiveDifficulty: QUESTION_COGNITIVE_DIFFICULTY_SORT_ORDER,
  status: QUESTION_STATUS_SORT_ORDER,
};

export { QUESTION_MONGOOSE_COLLECTION_NAME, QUESTION_SEMANTIC_SORT_ORDERS };