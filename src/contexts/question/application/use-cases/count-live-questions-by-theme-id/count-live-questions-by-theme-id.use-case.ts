import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

/**
 * Counts the live questions attached to a theme, where live means pending or active.
 *
 * Published to the `question-theme` context: the theme archive rule uses this count, while theme stats count only active questions.
 */
class CountLiveQuestionsByThemeIdUseCase {
  public constructor(private readonly questionRepository: QuestionRepository) {}

  public async execute(themeId: string): Promise<number> {
    return this.questionRepository.countLiveByThemeId(themeId);
  }
}

export { CountLiveQuestionsByThemeIdUseCase };