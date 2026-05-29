export class QuestionCreationError extends Error {
  public constructor() {
    super(`Failed to create question`);
    this.name = "QuestionCreationError";
  }
}