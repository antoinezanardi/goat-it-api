class QuestionNotFoundError extends Error {
  public constructor(questionId: string) {
    super(`Question with id ${questionId} not found`);
    this.name = "QuestionNotFoundError";
  }
}

export {
  QuestionNotFoundError,
};