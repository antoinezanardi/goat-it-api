import { Inject, Injectable } from "@nestjs/common";

import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question-theme/domain/repositories/question-theme.repository.constants";
import { createQuestionThemeStatsDtoFromStats } from "@question-theme/application/mappers/question-theme-stats/question-theme-stats.mappers";

import type { QuestionThemeStatsDto } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

import type { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";

@Injectable()
export class GetQuestionThemeStatsUseCase {
  public constructor(@Inject(QUESTION_THEME_REPOSITORY_TOKEN)
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async getStats(): Promise<QuestionThemeStatsDto> {
    const stats = await this.questionThemeRepository.getStats();

    return createQuestionThemeStatsDtoFromStats(stats);
  }
}