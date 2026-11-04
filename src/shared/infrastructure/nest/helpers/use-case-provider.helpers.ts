import type { FactoryProvider } from "@nestjs/common";

import type { UseCaseConstructor, UseCaseInjectionTokens } from "@shared/infrastructure/nest/helpers/use-case-provider.helpers.types";

function createUseCaseProvider<TUseCase, TDependencies extends readonly unknown[]>(
  UseCase: UseCaseConstructor<TUseCase, TDependencies>,
  tokens: UseCaseInjectionTokens<TDependencies>,
): FactoryProvider<TUseCase> {
  return {
    provide: UseCase,
    useFactory: (...dependencies: TDependencies): TUseCase => new UseCase(...dependencies),
    inject: tokens,
  };
}

export { createUseCaseProvider };