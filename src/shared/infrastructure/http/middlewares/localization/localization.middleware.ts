import { BadRequestException, Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { enum as zEnum } from "zod";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import { Locale } from "@shared/domain/value-objects/locale/locale.types";
import { AugmentedFastifyRequestRaw } from "@shared/infrastructure/http/types/fastify/fastify.types";

@Injectable()
export class LocalizationMiddleware implements NestMiddleware {
  public constructor(@Inject(AppConfigService) private readonly appConfigService: AppConfigService) {}

  private static getFirstLocaleFromHeader(headerLocale?: string): string | undefined {
    if (headerLocale === undefined) {
      return undefined;
    }
    const sliceStart = 0;
    const sliceEnd = 2;
    const locales = headerLocale.split(",").map(locale => locale.trim().slice(sliceStart, sliceEnd).toLowerCase());

    return locales[0];
  }

  private static useFallbackLocale(request: AugmentedFastifyRequestRaw, fallbackLocale: Locale, next: () => void): void {
    request.localizationOptions = {
      locale: fallbackLocale,
      fallbackLocale,
    };
    next();
  }

  public use(request: AugmentedFastifyRequestRaw, _: FastifyReply["raw"], next: () => void): void {
    const headerLocale = LocalizationMiddleware.getFirstLocaleFromHeader(request.headers["accept-language"]);
    const { fallbackLocale } = this.appConfigService.localizationConfig;
    if (headerLocale === undefined) {
      LocalizationMiddleware.useFallbackLocale(request, fallbackLocale, next);

      return;
    }
    const parsedLocale = zEnum(LOCALES).safeParse(headerLocale);
    if (!parsedLocale.success) {
      throw new BadRequestException(`Invalid locale '${headerLocale}' in 'Accept-Language' header, supported locales are: ${LOCALES.join(", ")} (only the first locale is considered)`);
    }

    request.localizationOptions = {
      locale: parsedLocale.data,
      fallbackLocale,
    };
    next();
  }
}