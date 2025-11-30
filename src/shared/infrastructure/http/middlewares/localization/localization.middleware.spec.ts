import { BadRequestException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { LocalizationMiddleware } from "@shared/infrastructure/http/middlewares/localization/localization.middleware";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";

import { createFakeLocalizationOptions } from "@faketories/shared/locale/locale.faketory";
import { createFakeLocalizationConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";

import type { AugmentedFastifyRequestRaw } from "@shared/infrastructure/http/types/fastify/fastify.types";
import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

describe("Localization Middleware", () => {
  let localizationMiddleware: LocalizationMiddleware;
  let mocks: {
    services: {
      appConfig: ReturnType<typeof createMockedAppConfigService>;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        appConfig: createMockedAppConfigService({
          localizationConfig: createFakeLocalizationConfigFromEnv({
            fallbackLocale: "en",
          }),
        }),
      },
    };
    const testingModule = await Test.createTestingModule({
      providers: [
        LocalizationMiddleware,
        {
          provide: AppConfigService,
          useValue: mocks.services.appConfig,
        },
      ],
    }).compile();

    localizationMiddleware = testingModule.get<LocalizationMiddleware>(LocalizationMiddleware);
  });

  describe("useFallbackLocale", () => {
    it("should set localization options with fallback locale when called.", () => {
      const fallbackLocale: Locale = "en";
      const request = {
        localizationOptions: {},
      };
      const next = vi.fn<() => void>();
      const expectedRequest = {
        localizationOptions: createFakeLocalizationOptions({
          locale: fallbackLocale,
          fallbackLocale,
        }),
      };
      const localizationMiddlewareStub = LocalizationMiddleware as unknown as { useFallbackLocale: (...parameters: unknown[]) => void };
      localizationMiddlewareStub.useFallbackLocale(request, fallbackLocale, next);

      expect(request).toStrictEqual(expectedRequest);
    });

    it("should call next function when called.", () => {
      const fallbackLocale: Locale = "en";
      const request = {
        localizationOptions: {},
      };
      const next = vi.fn<() => void>();
      const localizationMiddlewareStub = LocalizationMiddleware as unknown as { useFallbackLocale: (...parameters: unknown[]) => void };
      localizationMiddlewareStub.useFallbackLocale(request, fallbackLocale, next);

      expect(next).toHaveBeenCalledExactlyOnceWith();
    });
  });

  describe("use", () => {
    it("should set localization options with fallback locale when header locale is undefined.", () => {
      const requestRaw = {
        headers: {},
      };
      const next = vi.fn<() => void>();
      const expectedRequestRaw = {
        headers: {},
        localizationOptions: createFakeLocalizationOptions({
          locale: "en",
          fallbackLocale: "en",
        }),
      };
      localizationMiddleware.use(requestRaw as AugmentedFastifyRequestRaw, {} as never, next);

      expect(requestRaw).toStrictEqual(expectedRequestRaw);
    });

    it("should set localization options with parsed locale when header locale is valid.", () => {
      const requestRaw = {
        headers: {
          "accept-language": "fr, en;q=0.8",
        },
      };
      const next = vi.fn<() => void>();
      const expectedRequestRaw = {
        headers: {
          "accept-language": "fr, en;q=0.8",
        },
        localizationOptions: createFakeLocalizationOptions({
          locale: "fr",
          fallbackLocale: "en",
        }),
      };
      localizationMiddleware.use(requestRaw as AugmentedFastifyRequestRaw, {} as never, next);

      expect(requestRaw).toStrictEqual(expectedRequestRaw);
    });

    it("should call next function when header locale is valid.", () => {
      const requestRaw = {
        headers: {
          "accept-language": "de, en;q=0.8",
        },
      };
      const next = vi.fn<() => void>();
      localizationMiddleware.use(requestRaw as AugmentedFastifyRequestRaw, {} as never, next);

      expect(next).toHaveBeenCalledExactlyOnceWith();
    });

    it("should throw BadRequestException when header locale is invalid.", () => {
      const requestRaw = {
        headers: {
          "accept-language": "invalid-locale, en;q=0.8",
        },
      };
      const next = vi.fn<() => void>();
      const expectedError = new BadRequestException(`Invalid locale 'in' in 'Accept-Language' header, supported locales are: en, fr, es, de, it, pt (only the first locale is considered)`);

      expect(() => localizationMiddleware.use(requestRaw as AugmentedFastifyRequestRaw, {} as never, next)).toThrow(expectedError);
    });
  });

  describe("getFirstLocaleFromHeader", () => {
    it.each<{
      test: string;
      headerLocale: string | undefined;
      expectedLocale: string | undefined;
    }>([
      {
        test: "should return undefined when header locale is undefined.",
        headerLocale: undefined,
        expectedLocale: undefined,
      },
      {
        test: "should return fallback locale when header locale is '*'.",
        headerLocale: "*",
        expectedLocale: "en",
      },
      {
        test: "should return the first locale from the header when multiple locales are provided.",
        headerLocale: "fr, en;q=0.8, de;q=0.6",
        expectedLocale: "fr",
      },
      {
        test: "should return the first locale from the header when a single locale is provided.",
        headerLocale: "es",
        expectedLocale: "es",
      },
      {
        test: "should return the first locale in lowercase.",
        headerLocale: "IT, EN;q=0.8",
        expectedLocale: "it",
      },
      {
        test: "should return the first locale trimmed of whitespace.",
        headerLocale: "  pt  , en;q=0.8",
        expectedLocale: "pt",
      },
    ])("$test", ({ headerLocale, expectedLocale }) => {
      const result = localizationMiddleware["getFirstLocaleFromHeader"](headerLocale);

      expect(result).toBe(expectedLocale);
    });
  });
});