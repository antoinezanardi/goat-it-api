export class QuestionThemeReferencedByLiveQuestionsError extends Error {
  public constructor(questionThemeId: string, liveQuestionCount: number) {
    super(`Question theme with id ${questionThemeId} is referenced by ${liveQuestionCount} live question(s) and cannot be archived`);
    this.name = "QuestionThemeReferencedByLiveQuestionsError";
  }
}