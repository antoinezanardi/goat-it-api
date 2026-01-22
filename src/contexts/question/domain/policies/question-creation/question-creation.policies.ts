import { QUESTION_AUTHOR_ROLE_ADMIN } from "@question/domain/value-objects/question-author/question-author.constants";
import { QUESTION_STATUS_ACTIVE, QUESTION_STATUS_PENDING } from "@question/domain/value-objects/question-status/question-status.constants";

import type { QuestionCreationAuthorRole } from "@question/domain/value-objects/question-author/question-author.types";
import type { QuestionCreationStatus } from "@question/domain/value-objects/question-status/question-status.types";

function computeQuestionStatusFromAuthorRole(authorRole: QuestionCreationAuthorRole): QuestionCreationStatus {
  if (authorRole === QUESTION_AUTHOR_ROLE_ADMIN) {
    return QUESTION_STATUS_ACTIVE;
  }
  return QUESTION_STATUS_PENDING;
}

export {
  computeQuestionStatusFromAuthorRole,
};