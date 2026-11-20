import { createUseCaseProvider } from "@shared/infrastructure/nest/helpers/use-case-provider.helpers";

import type { FactoryProvider } from "@nestjs/common";

type FakeRepository = {
  readonly id: string;
};

type FakeDependency = {
  readonly id: string;
};

class FakeUseCase {
  public readonly repository: FakeRepository;

  public readonly dependency: FakeDependency;

  public constructor(repository: FakeRepository, dependency: FakeDependency) {
    this.repository = repository;
    this.dependency = dependency;
  }
}

const FAKE_REPOSITORY_TOKEN = Symbol("FakeRepository");

const FAKE_DEPENDENCY_TOKEN = Symbol("FakeDependency");

describe(createUseCaseProvider, () => {
  let provider: FactoryProvider<FakeUseCase>;
  let repository: FakeRepository;
  let dependency: FakeDependency;

  beforeEach(() => {
    repository = { id: "repository" };
    dependency = { id: "dependency" };
    provider = createUseCaseProvider(FakeUseCase, [FAKE_REPOSITORY_TOKEN, FAKE_DEPENDENCY_TOKEN]);
  });

  it("should expose the use case class as the provider token when called.", () => {
    expect(provider.provide).toBe(FakeUseCase);
  });

  it("should list the injection tokens in constructor parameter order when called.", () => {
    expect(provider.inject).toStrictEqual([FAKE_REPOSITORY_TOKEN, FAKE_DEPENDENCY_TOKEN]);
  });

  it("should construct the use case with the first dependency when the factory runs.", async() => {
    const useCase = await provider.useFactory(repository, dependency);

    expect(useCase.repository).toBe(repository);
  });

  it("should construct the use case with the second dependency when the factory runs.", async() => {
    const useCase = await provider.useFactory(repository, dependency);

    expect(useCase.dependency).toBe(dependency);
  });

  it("should create a use case instance when the factory runs.", async() => {
    const useCase = await provider.useFactory(repository, dependency);

    expect(useCase).toBeInstanceOf(FakeUseCase);
  });
});