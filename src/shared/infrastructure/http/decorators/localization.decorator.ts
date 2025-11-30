import { createParamDecorator, InternalServerErrorException } from "@nestjs/common";

import type { ExecutionContext } from "@nestjs/common";

import type { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";
import type { AugmentedFastifyRequest } from "@shared/infrastructure/http/types/fastify/fastify.types";

function getLocalizationOptionsFromContext(_: unknown, context: ExecutionContext): LocalizationOptions {
  const request = context.switchToHttp().getRequest<AugmentedFastifyRequest>();
  const { localizationOptions } = request.raw;

  if (!localizationOptions) {
    throw new InternalServerErrorException("Missing localizationOptions on request. Ensure LocalizationMiddleware is applied to this route.");
  }
  return localizationOptions;
}

/**
 * Parameter decorator that extracts localization options from the request.
 * Must be used on routes where LocalizationMiddleware is applied.
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