import { Test } from "@nestjs/testing";

import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { GetQuestionStatsUseCase } from "@question/application/use-cases/get-question-stats/get-question-stats.use-case";

import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";

import { createFakeQuestionStats } from "@faketories/contexts/question/domain/question-stats/question-stats.faketory";

describe("Get Question Stats Use Case", () => {
  let useCase: GetQuestionStatsUseCase;
  let mockedRepository: ReturnType<typeof createMockedQuestionRepository>;

  beforeEach(async() => {
    mockedRepository = createMockedQuestionRepository();
    const module = await Test.createTestingModule({
      providers: [
        GetQuestionStatsUseCase,
        {
          provide: QUESTION_REPOSITORY_TOKEN,
          useValue: mockedRepository,
        },
      ],
    }).compile();
    useCase = module.get(GetQuestionStatsUseCase);
  });

  describe(GetQuestionStatsUseCase.prototype.getStats, () => {
    it("should call repository.getStats when invoked.", async() => {
      await useCase.getStats();

      expect(mockedRepository.getStats).toHaveBeenCalledExactlyOnceWith();
    });

    it("should return mapped DTO with all status keys present when stats are retrieved.", async() => {
      const stats = createFakeQuestionStats({ total: 1 });
      mockedRepository.getStats.mockResolvedValueOnce(stats);

      const result = await useCase.getStats();

      expect(Object.keys(result.byStatus)).toStrictEqual(["pending", "active", "archived", "rejected"]);
    });

    it("should return mapped DTO with correct total when repository returns total.", async() => {
      const stats = createFakeQuestionStats({ total: 7 });
      mockedRepository.getStats.mockResolvedValueOnce(stats);

      const result = await useCase.getStats();

      expect(result.total).toBe(7);
    });
  });
});