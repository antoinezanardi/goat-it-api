import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

class CountLiveQuestionsByThemeIdUseCase {
  public constructor(private readonly questionRepository: QuestionRepository) {}

  public async execute(themeId: string): Promise<number> {
    return this.questionRepository.countLiveByThemeId(themeId);
  }
}

export { CountLiveQuestionsByThemeIdUseCase };