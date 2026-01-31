import type { Mock } from "vitest";

type CheckQuestionThemesExistenceUseCaseStub = {
  getByIdsOrThrow: (ids: Set<string>) => Promise<void>;
};

type MockedCheckQuestionThemesExistenceUseCase = { [K in keyof CheckQuestionThemesExistenceUseCaseStub]: Mock<CheckQuestionThemesExistenceUseCaseStub[K]> };

function createMockedCheckQuestionThemesExistenceUseCase(overrides: Partial<MockedCheckQuestionThemesExistenceUseCase> = {}): MockedCheckQuestionThemesExistenceUseCase {
  return {
    getByIdsOrThrow: vi.fn<CheckQuestionThemesExistenceUseCaseStub["getByIdsOrThrow"]>().mockResolvedValue(),
    ...overrides,
  };
}

export { createMockedCheckQuestionThemesExistenceUseCase };