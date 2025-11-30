import { BadRequestException, Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { z } from "zod";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import { Locale } from "@shared/domain/value-objects/locale/locale.types";
import { AugmentedFastifyRequestRaw } from "@shared/infrastructure/http/types/fastify/fastify.types";

@Injectable()
export class LocalizationMiddleware implements NestMiddleware {
  public constructor(@Inject(AppConfigService) private readonly appConfigService: AppConfigService) {}

  private static useFallbackLocale(requestRaw: AugmentedFastifyRequestRaw, fallbackLocale: Locale, next: () => void): void {
    requestRaw.localizationOptions = {
      locale: fallbackLocale,
      fallbackLocale,
    };
    next();
  }

  public use(requestRaw: AugmentedFastifyRequestRaw, _: FastifyReply["raw"], next: () => void): void {
    const headerLocale = this.getFirstLocaleFromHeader(requestRaw.headers["accept-language"]);
    const { fallbackLocale } = this.appConfigService.localizationConfig;
    if (headerLocale === undefined) {
      LocalizationMiddleware.useFallbackLocale(requestRaw, fallbackLocale, next);

      return;
    }
    const parsedLocale = z.enum(LOCALES).safeParse(headerLocale);
    if (!parsedLocale.success) {
      throw new BadRequestException(`Invalid locale '${headerLocale}' in 'Accept-Language' header, supported locales are: ${LOCALES.join(", ")} (only the first locale is considered)`);
    }

    requestRaw.localizationOptions = {
      locale: parsedLocale.data,
      fallbackLocale,
    };
    next();
  }

  private getFirstLocaleFromHeader(headerLocale?: string): string | undefined {
    if (headerLocale === undefined) {
      return undefined;
    }
    const { fallbackLocale } = this.appConfigService.localizationConfig;
    const sliceStart = 0;
    const sliceEnd = 2;
    const firstLocale = headerLocale.trim().slice(sliceStart, sliceEnd).toLowerCase();
    if (firstLocale === "*") {
      return fallbackLocale;
    }
    return firstLocale;
  }
}