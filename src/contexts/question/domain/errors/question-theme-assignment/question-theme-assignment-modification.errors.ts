class QuestionThemeAssignmentModificationError extends Error {
  public constructor(questionThemeId: string, questionId: string) {
    super(`Question theme assignment with id ${questionThemeId} could not be modified in question with id ${questionId}`);
    this.name = "QuestionThemeAssignmentModificationError";
  }
}

export {
  QuestionThemeAssignmentModificationError,
};