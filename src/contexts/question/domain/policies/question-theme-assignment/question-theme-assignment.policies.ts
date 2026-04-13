import { QuestionPrimaryThemeAssignmentNotRemovableError, QuestionThemeAssignmentAbsentError } from "@question/domain/errors/question-theme-assignment/question-theme-assignment.errors";
import { findQuestionThemeAssignmentInQuestionByThemeId } from "@question/domain/helpers/question-theme-assignment/question-theme-assignment.helpers";

import type { Question } from "@question/domain/entities/question.types";

function ensureQuestionPrimaryThemeAssignmentIsNotRemovable(question: Question, themeId: string): void {
  const assignment = findQuestionThemeAssignmentInQuestionByThemeId(question, themeId);
  if (assignment?.isPrimary === true) {
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
  ensureQuestionPrimaryThemeAssignmentIsNotRemovable,
  ensureQuestionThemeAssignmentIsModifiable,
};