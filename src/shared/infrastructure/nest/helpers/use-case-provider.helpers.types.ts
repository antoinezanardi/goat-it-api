import type { InjectionToken } from "@nestjs/common";

type UseCaseConstructor<TUseCase, TDependencies extends readonly unknown[]> = new (...dependencies: TDependencies) => TUseCase;

type UseCaseInjectionTokens<TDependencies extends readonly unknown[]> = {
  -readonly [TIndex in keyof TDependencies]: InjectionToken;
};

export type {
  UseCaseConstructor,
  UseCaseInjectionTokens,
};