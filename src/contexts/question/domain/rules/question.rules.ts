import { QuestionPrimaryThemeAssignmentNotRemovableError } from "@question/domain/errors/question-primary-theme-assignment-not-removable/question-primary-theme-assignment-not-removable.error";
import { QuestionThemeAssignmentAbsentError } from "@question/domain/errors/question-theme-assignment-absent/question-theme-assignment-absent.error";
import { QuestionMaximumThemesError } from "@question/domain/errors/question-maximum-themes/question-maximum-themes.error";
import { QUESTION_AUTHOR_ROLE_ADMIN, QUESTION_STATUS_ACTIVE, QUESTION_STATUS_PENDING, QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS } from "@question/domain/constants/question.constants";
import type { Question } from "@question/domain/types/question.entities";
import type { QuestionCreationAuthorRole, QuestionCreationStatus, QuestionThemeAssignment } from "@question/domain/types/question.value-objects";

/**
 * Derives the stored status from the author role: an admin-authored question is active, every other role yields a pending question.
 */
function computeQuestionStatusFromAuthorRole(authorRole: QuestionCreationAuthorRole): QuestionCreationStatus {
  if (authorRole === QUESTION_AUTHOR_ROLE_ADMIN) {
    return QUESTION_STATUS_ACTIVE;
  }
  return QUESTION_STATUS_PENDING;
}

/**
 * Returns the assignment carrying the given theme id, or `undefined` when the question does not use that theme.
 */
function findQuestionThemeAssignmentInQuestionByThemeId(question: Question, questionThemeAssignmentId: string): QuestionThemeAssignment | undefined {
  return question.themes.find(({ theme }) => theme.id === questionThemeAssignmentId);
}

/**
 * Protects the removal invariant: a question can only drop a theme it actually uses, and never its primary theme.
 *
 * @throws `QuestionThemeAssignmentAbsentError` when the question has no assignment for `themeId`.
 * @throws `QuestionPrimaryThemeAssignmentNotRemovableError` when that assignment is the primary one.
 */
function ensureQuestionThemeAssignmentIsRemovable(question: Question, themeId: string): void {
  const assignment = findQuestionThemeAssignmentInQuestionByThemeId(question, themeId);
  if (!assignment) {
    throw new QuestionThemeAssignmentAbsentError(themeId, question.id);
  }
  if (assignment.isPrimary) {
    throw new QuestionPrimaryThemeAssignmentNotRemovableError(themeId, question.id);
  }
}

/**
 * Protects the modification invariant: only an assignment the question already holds can be modified.
 *
 * @throws `QuestionThemeAssignmentAbsentError` when the question has no assignment for `themeId`.
 */
function ensureQuestionThemeAssignmentIsModifiable(question: Question, themeId: string): void {
  const assignment = findQuestionThemeAssignmentInQuestionByThemeId(question, themeId);
  if (!assignment) {
    throw new QuestionThemeAssignmentAbsentError(themeId, question.id);
  }
}

/**
 * Protects the theme-count ceiling: a question that already holds the maximum number of assignments cannot accept another one.
 *
 * @throws `QuestionMaximumThemesError` when the question already holds at least `QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS` assignments.
 */
function ensureQuestionThemeAssignmentsLimit(question: Question): void {
  if (question.themes.length >= QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS) {
    throw new QuestionMaximumThemesError(question.id);
  }
}

export {
  computeQuestionStatusFromAuthorRole,
  findQuestionThemeAssignmentInQuestionByThemeId,
  ensureQuestionThemeAssignmentIsRemovable,
  ensureQuestionThemeAssignmentIsModifiable,
  ensureQuestionThemeAssignmentsLimit,
};