import { InternalServerErrorException } from "@nestjs/common";
import { ROUTE_ARGS_METADATA } from "@nestjs/common/constants";

import { getLocalizationOptionsFromContext, Localization } from "@shared/infrastructure/http/decorators/localization/localization.decorator";

import { createFakeLocalizationOptions } from "@faketories/shared/locale/locale.faketory";

import type { ExecutionContext } from "@nestjs/common";
import type { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";

describe(getLocalizationOptionsFromContext, () => {
  it("should return localization options from execution context when called.", () => {
    const expectedLocalizationOptions = createFakeLocalizationOptions({
      locale: "fr",
      fallbackLocale: "en",
    });
    const fakeExecutionContext = {
      switchToHttp: (): unknown => ({
        getRequest: (): unknown => ({
          raw: {
            localizationOptions: expectedLocalizationOptions,
          },
        }),
      }),
    };
    const result = getLocalizationOptionsFromContext({}, fakeExecutionContext as unknown as ExecutionContext);

    expect(result).toBe(expectedLocalizationOptions);
  });

  it("should throw an InternalServerErrorException when localization options are missing in the request.", () => {
    const fakeExecutionContext = {
      switchToHttp: (): unknown => ({
        getRequest: (): unknown => ({
          raw: {},
        }),
      }),
    };
    const expectedError = new InternalServerErrorException("Missing localizationOptions on request. Ensure LocalizationMiddleware is applied to this route.");

    expect(() => getLocalizationOptionsFromContext({}, fakeExecutionContext as unknown as ExecutionContext)).toThrow(expectedError);
  });
});

describe(Localization, () => {
  it("should register the getLocalizationOptionsFromContext factory when applied to a handler parameter.", () => {
    class StubController {
      public handler(@Localization() localizationOptions: LocalizationOptions): { controller: StubController; localizationOptions: LocalizationOptions } {
        return { controller: this, localizationOptions };
      }
    }

    // Acceptable as Reflector cannot read property-keyed parameter metadata
    // eslint-disable-next-line unicorn/no-nonstandard-builtin-properties
    const routeArgumentsMetadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, StubController, "handler") as Record<string, { index: number; factory: unknown }>;
    const registeredParameterMetadata = Object.values(routeArgumentsMetadata).map(({ index, factory }) => ({ index, factory }));

    expect(registeredParameterMetadata).toStrictEqual([{ index: 0, factory: getLocalizationOptionsFromContext }]);
  });
});