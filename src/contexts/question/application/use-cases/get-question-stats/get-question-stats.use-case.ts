import { createQuestionStatsDtoFromStats } from "@question/application/mappers/question-stats/question-stats.mappers";
import type { QuestionStatsDto } from "@question/application/dto/question-stats/question-stats.dto.shape";

import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

/**
 * Aggregates the question counters and maps them to the stats response shape.
 */
export class GetQuestionStatsUseCase {
  public constructor(private readonly questionRepository: QuestionRepository) {}

  public async getStats(): Promise<QuestionStatsDto> {
    const stats = await this.questionRepository.getStats();

    return createQuestionStatsDtoFromStats(stats);
  }
}