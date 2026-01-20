class QuestionPersistenceMappingError extends Error {
  public constructor(questionId: string, details?: string) {
    const causeMessage = details === undefined ? "" : ` Cause: ${details}`;

    super(`Failed to map Question with ID '${questionId}' from persistence layer.${causeMessage}`);
    this.name = "QuestionPersistenceMappingError";
  }
}

export {
  QuestionPersistenceMappingError,
};