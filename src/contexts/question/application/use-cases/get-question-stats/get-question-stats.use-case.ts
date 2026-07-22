import { Inject, Injectable } from "@nestjs/common";

import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { createQuestionStatsDtoFromStats } from "@question/application/mappers/question-stats/question-stats.mappers";
import type { QuestionStatsDto } from "@question/application/dto/question-stats/question-stats.dto.shape";

import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

@Injectable()
export class GetQuestionStatsUseCase {
  public constructor(@Inject(QUESTION_REPOSITORY_TOKEN)
  private readonly questionRepository: QuestionRepository) {}

  public async getStats(): Promise<QuestionStatsDto> {
    const stats = await this.questionRepository.getStats();

    return createQuestionStatsDtoFromStats(stats);
  }
}