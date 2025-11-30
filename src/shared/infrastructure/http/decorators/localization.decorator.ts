import { createParamDecorator } from "@nestjs/common";

import type { ExecutionContext } from "@nestjs/common";

import type { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";
import type { AugmentedFastifyRequest } from "@shared/infrastructure/http/types/fastify/fastify.types";

function getLocalizationOptionsFromContext(_: unknown, context: ExecutionContext): LocalizationOptions {
  const request = context.switchToHttp().getRequest<AugmentedFastifyRequest>();

  return request.raw.localizationOptions;
}

function Localization(): ParameterDecorator {
  const createLocalizationDecoratorFactory = createParamDecorator<unknown, LocalizationOptions>(getLocalizationOptionsFromContext);

  return createLocalizationDecoratorFactory();
}

export {
  getLocalizationOptionsFromContext,
  Localization,
};