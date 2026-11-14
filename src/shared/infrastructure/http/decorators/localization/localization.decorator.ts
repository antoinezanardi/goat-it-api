import { createParamDecorator, InternalServerErrorException } from "@nestjs/common";

import type { ExecutionContext } from "@nestjs/common";

import type { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";
import type { AugmentedFastifyRequest } from "@shared/infrastructure/http/types/fastify/fastify.types";

/**
 * Reads the localization options that `LocalizationMiddleware` attached to the raw request.
 *
 * @throws `InternalServerErrorException` when the middleware did not run, which signals a route wiring error rather than a client error.
 */
function getLocalizationOptionsFromContext(_: unknown, context: ExecutionContext): LocalizationOptions {
  const request = context.switchToHttp().getRequest<AugmentedFastifyRequest>();
  const { localizationOptions } = request.raw;

  if (!localizationOptions) {
    throw new InternalServerErrorException("Missing localizationOptions on request. Ensure LocalizationMiddleware is applied to this route.");
  }
  return localizationOptions;
}

/**
 * Parameter decorator that exposes the localization options resolved by `LocalizationMiddleware`.
 *
 * The route must be covered by the middleware; otherwise the request fails with a 500 Internal Server Error.
 *
 * @example
 * ```typescript
 * @Get()
 * async findAll(@Localization() localization: LocalizationOptions) {
 *   // ...
 * }
 * ```
 */
function Localization(): ParameterDecorator {
  const createLocalizationDecoratorFactory = createParamDecorator<unknown, LocalizationOptions>(getLocalizationOptionsFromContext);

  return createLocalizationDecoratorFactory();
}

export {
  getLocalizationOptionsFromContext,
  Localization,
};