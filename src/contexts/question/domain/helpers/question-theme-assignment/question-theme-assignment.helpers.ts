import type { Question } from "@question/domain/entities/question.types";
import type { QuestionThemeAssignment } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.types";

function findQuestionThemeAssignmentInQuestionByThemeId(question: Question, questionThemeAssignmentId: string): QuestionThemeAssignment | undefined {
  return question.themes.find(({ theme }) => theme.id === questionThemeAssignmentId);
}

export {
  findQuestionThemeAssignmentInQuestionByThemeId,
};