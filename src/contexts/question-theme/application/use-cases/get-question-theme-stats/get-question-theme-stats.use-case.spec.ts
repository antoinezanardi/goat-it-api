import { QUESTION_THEME_STATUSES } from "@question-theme/domain/constants/question-theme.constants";
import { GetQuestionThemeStatsUseCase } from "@question-theme/application/use-cases/get-question-theme-stats/get-question-theme-stats.use-case";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question-theme/domain/repositories/question-theme.repository.mock";

import { createFakeQuestionThemeStats } from "@faketories/contexts/question-theme/domain/question-theme-stats/question-theme-stats.faketory";

describe(GetQuestionThemeStatsUseCase, () => {
  let useCase: GetQuestionThemeStatsUseCase;
  let mockedRepository: ReturnType<typeof createMockedQuestionThemeRepository>;

  beforeEach(() => {
    mockedRepository = createMockedQuestionThemeRepository();
    useCase = new GetQuestionThemeStatsUseCase(mockedRepository);
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

      expect(Object.keys(result.byStatus)).toStrictEqual([...QUESTION_THEME_STATUSES]);
    });

    it("should return mapped DTO with correct total when repository returns total.", async() => {
      const stats = createFakeQuestionThemeStats({ total: 5 });
      mockedRepository.getStats.mockResolvedValueOnce(stats);

      const result = await useCase.getStats();

      expect(result.total).toBe(5);
    });
  });
});