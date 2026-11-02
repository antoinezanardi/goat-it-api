import { CountLiveQuestionsByThemeIdUseCase } from "@question/application/use-cases/count-live-questions-by-theme-id/count-live-questions-by-theme-id.use-case";

import { createMockedQuestionRepository } from "@mocks/contexts/question/domain/repositories/question.repository.mock";

describe(CountLiveQuestionsByThemeIdUseCase, () => {
  let countLiveQuestionsByThemeIdUseCase: CountLiveQuestionsByThemeIdUseCase;
  let mocks: { repositories: { question: ReturnType<typeof createMockedQuestionRepository> } };

  beforeEach(() => {
    mocks = { repositories: { question: createMockedQuestionRepository() } };

    countLiveQuestionsByThemeIdUseCase = new CountLiveQuestionsByThemeIdUseCase(mocks.repositories.question);
  });

  describe(CountLiveQuestionsByThemeIdUseCase.prototype.execute, () => {
    it.each<{ themeId: string; liveQuestionCount: number }>([
      { themeId: "theme-id-1", liveQuestionCount: 0 },
      { themeId: "theme-id-2", liveQuestionCount: 3 },
      { themeId: "theme-id-3", liveQuestionCount: 42 },
    ])("should return $liveQuestionCount live questions when repository returns that count for theme \"$themeId\".", async({ themeId, liveQuestionCount }) => {
      mocks.repositories.question.countLiveByThemeId.mockResolvedValueOnce(liveQuestionCount);

      const actual = await countLiveQuestionsByThemeIdUseCase.execute(themeId);

      expect(actual).toBe(liveQuestionCount);
    });

    it("should call repository.countLiveByThemeId with the theme id when called.", async() => {
      const themeId = "theme-id-1";

      await countLiveQuestionsByThemeIdUseCase.execute(themeId);

      expect(mocks.repositories.question.countLiveByThemeId).toHaveBeenCalledExactlyOnceWith(themeId);
    });
  });
});