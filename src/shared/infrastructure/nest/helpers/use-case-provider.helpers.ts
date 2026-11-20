import type { FactoryProvider } from "@nestjs/common";

import type { UseCaseConstructor, UseCaseInjectionTokens } from "@shared/infrastructure/nest/helpers/use-case-provider.helpers.types";

/**
 * Wraps a plain use case class in a NestJS factory provider whose token is the class itself.
 *
 * `tokens` is matched positionally against the constructor parameters, so it must list one token per dependency in declaration order; NestJS resolves them without `@Inject()`.
 */
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