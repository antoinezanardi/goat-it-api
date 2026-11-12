import type { InjectionToken } from "@nestjs/common";

/**
 * Constructor signature of a plain use case, parameterized by its dependency tuple.
 */
type UseCaseConstructor<TUseCase, TDependencies extends readonly unknown[]> = new (...dependencies: TDependencies) => TUseCase;

/**
 * Maps the dependency tuple to the injection tokens NestJS resolves for the factory, in constructor parameter order.
 */
type UseCaseInjectionTokens<TDependencies extends readonly unknown[]> = {
  -readonly [TIndex in keyof TDependencies]: InjectionToken;
};

export type {
  UseCaseConstructor,
  UseCaseInjectionTokens,
};