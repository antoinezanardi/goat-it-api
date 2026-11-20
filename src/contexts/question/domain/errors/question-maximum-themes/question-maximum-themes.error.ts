import { QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS } from "@question/domain/constants/question.constants";

export class QuestionMaximumThemesError extends Error {
  public constructor(questionId: string) {
    super(`Question with id ${questionId} cannot have more than ${QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS} themes assigned`);
    this.name = "QuestionMaximumThemesError";
  }
}