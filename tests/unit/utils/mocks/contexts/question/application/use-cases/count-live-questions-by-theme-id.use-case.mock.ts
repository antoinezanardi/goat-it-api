import type { Mock } from "vitest";

type CountLiveQuestionsByThemeIdStub = {
  execute: (themeId: string) => Promise<number>;
};

type MockedCountLiveQuestionsByThemeIdUseCase = { [K in keyof CountLiveQuestionsByThemeIdStub]: Mock<CountLiveQuestionsByThemeIdStub[K]> };

function createMockedCountLiveQuestionsByThemeIdUseCase(overrides: Partial<MockedCountLiveQuestionsByThemeIdUseCase> = {}): MockedCountLiveQuestionsByThemeIdUseCase {
  return {
    execute: vi.fn<CountLiveQuestionsByThemeIdStub["execute"]>().mockResolvedValue(0),
    ...overrides,
  };
}

export { createMockedCountLiveQuestionsByThemeIdUseCase };