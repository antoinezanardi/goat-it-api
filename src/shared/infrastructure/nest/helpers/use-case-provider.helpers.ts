import type { FactoryProvider } from "@nestjs/common";

import type { UseCaseConstructor, UseCaseInjectionTokens } from "@shared/infrastructure/nest/helpers/use-case-provider.helpers.types";

function createUseCaseProvider<TUseCase, TDependencies extends readonly unknown[]>(
  useCase: UseCaseConstructor<TUseCase, TDependencies>,
  tokens: UseCaseInjectionTokens<TDependencies>,
): FactoryProvider<TUseCase> {
  return {
    provide: useCase,
    // Acceptable as the use-case class is received as a generic constructor parameter whose name must stay camelCase
    // oxlint-disable-next-line eslint/new-cap
    useFactory: (...dependencies: TDependencies): TUseCase => new useCase(...dependencies),
    inject: tokens,
  };
}

export { createUseCaseProvider };