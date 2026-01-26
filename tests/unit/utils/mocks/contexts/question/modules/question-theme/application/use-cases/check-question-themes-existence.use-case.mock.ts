import type { Mock } from "vitest";

type CheckQuestionThemesExistenceUseCaseStub = {
  checkExistenceByIds: (ids: Set<string>) => Promise<void>;
};

type MockedCheckQuestionThemesExistenceUseCase = { [K in keyof CheckQuestionThemesExistenceUseCaseStub]: Mock<CheckQuestionThemesExistenceUseCaseStub[K]> };

function createMockedCheckQuestionThemesExistenceUseCase(overrides: Partial<MockedCheckQuestionThemesExistenceUseCase> = {}): MockedCheckQuestionThemesExistenceUseCase {
  return {
    checkExistenceByIds: vi.fn<CheckQuestionThemesExistenceUseCaseStub["checkExistenceByIds"]>().mockResolvedValue(),
    ...overrides,
  };
}

export { createMockedCheckQuestionThemesExistenceUseCase };