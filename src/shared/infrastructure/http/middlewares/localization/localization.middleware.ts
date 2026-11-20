import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { z } from "zod";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import type { FastifyReply } from "fastify";
import type { NestMiddleware } from "@nestjs/common";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";
import type { AugmentedFastifyRequestRaw } from "@shared/infrastructure/http/types/fastify/fastify.types";

/**
 * Resolves the request locale from the `Accept-Language` header and attaches it, with the configured fallback, to the raw request.
 *
 * Only the first locale is considered, and a `*` or missing header resolves to the fallback locale. Any unsupported locale is
 * rejected with a 400, so downstream handlers always receive a supported locale.
 */
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
    const localeLength = 2;
    const firstLocale = headerLocale.trim().slice(0, localeLength).toLowerCase();
    if (firstLocale === "*") {
      return fallbackLocale;
    }
    return firstLocale;
  }
}