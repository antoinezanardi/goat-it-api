export class QuestionThemeSlugAlreadyExistsError extends Error {
  public constructor(slug: string) {
    super(`Question theme with slug ${slug} already exists`);
    this.name = "QuestionThemeSlugAlreadyExistsError";
  }
}