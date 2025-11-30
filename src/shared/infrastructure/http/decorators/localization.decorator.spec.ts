import { InternalServerErrorException } from "@nestjs/common";

import { getLocalizationOptionsFromContext, Localization } from "@shared/infrastructure/http/decorators/localization.decorator";

import { createFakeLocalizationOptions } from "@faketories/shared/locale/locale.faketory";

import type { ExecutionContext } from "@nestjs/common";

describe("Localization Decorator", () => {
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

      expect(() => getLocalizationOptionsFromContext({}, fakeExecutionContext as unknown as ExecutionContext)).toThrowError(expectedError);
    });
  });

  describe(Localization, () => {
    it("should return a parameter decorator when called.", () => {
      const decorator = Localization();

      expectTypeOf(decorator).toBeFunction();
    });
  });
});