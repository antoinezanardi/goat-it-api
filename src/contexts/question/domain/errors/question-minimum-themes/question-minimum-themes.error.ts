import { QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS } from "@question/domain/constants/question.constants";

export class QuestionMinimumThemesError extends Error {
  public constructor(questionId: string) {
    super(`Question with id ${questionId} must have at least ${QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS} theme assigned`);
    this.name = "QuestionMinimumThemesError";
  }
}