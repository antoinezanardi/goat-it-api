import { Test } from "@nestjs/testing";

import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question-theme/domain/repositories/question-theme.repository.constants";
import { GetQuestionThemeStatsUseCase } from "@question-theme/application/use-cases/get-question-theme-stats/get-question-theme-stats.use-case";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.repository.mock";

import { createFakeQuestionThemeStats } from "@faketories/contexts/question-theme/domain/question-theme-stats/question-theme-stats.faketory";

describe("Get Question Theme Stats Use Case", () => {
  let useCase: GetQuestionThemeStatsUseCase;
  let mockedRepository: ReturnType<typeof createMockedQuestionThemeRepository>;

  beforeEach(async() => {
    mockedRepository = createMockedQuestionThemeRepository();
    const module = await Test.createTestingModule({
      providers: [
        GetQuestionThemeStatsUseCase,
        {
          provide: QUESTION_THEME_REPOSITORY_TOKEN,
          useValue: mockedRepository,
        },
      ],
    }).compile();
    useCase = module.get(GetQuestionThemeStatsUseCase);
  });

  describe(GetQuestionThemeStatsUseCase.prototype.getStats, () => {
    it("should call repository.getStats when invoked.", async() => {
      await useCase.getStats();

      expect(mockedRepository.getStats).toHaveBeenCalledExactlyOnceWith();
    });

    it("should return mapped DTO with all status keys present when stats are retrieved.", async() => {
      const stats = createFakeQuestionThemeStats({ total: 1 });
      mockedRepository.getStats.mockResolvedValueOnce(stats);

      const result = await useCase.getStats();

      expect(Object.keys(result.byStatus)).toStrictEqual(["active", "archived"]);
    });

    it("should return mapped DTO with correct total when repository returns total.", async() => {
      const stats = createFakeQuestionThemeStats({ total: 5 });
      mockedRepository.getStats.mockResolvedValueOnce(stats);

      const result = await useCase.getStats();

      expect(result.total).toBe(5);
    });
  });
});