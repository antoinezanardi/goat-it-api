import { Inject, Injectable } from "@nestjs/common";

import { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";
import { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";

@Injectable()
export class FindAllQuestionThemesUseCase {
  public constructor(@Inject("QuestionThemeRepository")
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async list(): Promise<QuestionTheme[]> {
    return this.questionThemeRepository.findAll();
  }
}