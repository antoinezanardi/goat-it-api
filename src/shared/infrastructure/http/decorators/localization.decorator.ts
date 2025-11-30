import { createParamDecorator } from "@nestjs/common";

import type { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";
import type { AugmentedFastifyRequest } from "@shared/infrastructure/http/types/fastify/fastify.types";

function Localization(): ParameterDecorator {
  return createParamDecorator<unknown, LocalizationOptions>((_, context): LocalizationOptions => {
    const request = context.switchToHttp().getRequest<AugmentedFastifyRequest>();

    return request.raw.localizationOptions;
  })();
}

export { Localization };