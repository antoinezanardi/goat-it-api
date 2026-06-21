import { QuestionPrimaryThemeAssignmentNotRemovableError } from "@question/domain/errors/question-primary-theme-assignment-not-removable/question-primary-theme-assignment-not-removable.error";
import { QuestionThemeAssignmentAbsentError } from "@question/domain/errors/question-theme-assignment-absent/question-theme-assignment-absent.error";
import { QUESTION_AUTHOR_ROLE_ADMIN, QUESTION_STATUS_ACTIVE, QUESTION_STATUS_PENDING } from "@question/domain/constants/question.constants";
import type { Question } from "@question/domain/types/question.entities";
import type { QuestionCreationAuthorRole, QuestionCreationStatus, QuestionThemeAssignment } from "@question/domain/types/question.value-objects";

function computeQuestionStatusFromAuthorRole(authorRole: QuestionCreationAuthorRole): QuestionCreationStatus {
  if (authorRole === QUESTION_AUTHOR_ROLE_ADMIN) {
    return QUESTION_STATUS_ACTIVE;
  }
  return QUESTION_STATUS_PENDING;
}

function findQuestionThemeAssignmentInQuestionByThemeId(question: Question, questionThemeAssignmentId: string): QuestionThemeAssignment | undefined {
  return question.themes.find(({ theme }) => theme.id === questionThemeAssignmentId);
}

function ensureQuestionThemeAssignmentIsRemovable(question: Question, themeId: string): void {
  const assignment = findQuestionThemeAssignmentInQuestionByThemeId(question, themeId);
  if (!assignment) {
    throw new QuestionThemeAssignmentAbsentError(themeId, question.id);
  }
  if (assignment.isPrimary) {
    throw new QuestionPrimaryThemeAssignmentNotRemovableError(themeId, question.id);
  }
}

function ensureQuestionThemeAssignmentIsModifiable(question: Question, themeId: string): void {
  const assignment = findQuestionThemeAssignmentInQuestionByThemeId(question, themeId);
  if (!assignment) {
    throw new QuestionThemeAssignmentAbsentError(themeId, question.id);
  }
}

export {
  computeQuestionStatusFromAuthorRole,
  findQuestionThemeAssignmentInQuestionByThemeId,
  ensureQuestionThemeAssignmentIsRemovable,
  ensureQuestionThemeAssignmentIsModifiable,
};