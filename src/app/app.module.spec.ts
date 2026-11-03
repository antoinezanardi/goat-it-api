import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, Reflector } from "@nestjs/core";

import { AppModule } from "@app/app.module";
import { GlobalExceptionFilter } from "@app/filters/global-exception/global-exception.filter";

import { LocalizationMiddleware } from "@shared/infrastructure/http/middlewares/localization/localization.middleware";

const originalEnvironmentVariables = vi.hoisted(() => {
  const testEnvironmentVariables = {
    SERVER_HOST: "0.0.0.0",
    SERVER_PORT: "4242",
    CORS_ORIGIN: "*",
    MONGODB_HOST: "0.0.0.0",
    MONGODB_PORT: "27017",
    MONGODB_DATABASE: "goat-it-test",
    FALLBACK_LOCALE: "en",
    API_KEY_HMAC_SECRET: "test_hmac_secret_key_for_api_key_signing_1234",
    ADMIN_API_KEY: "test_admin_api_key_for_testing",
    GAME_API_KEY: "test_game_api_key_for_testing",
  };
  const originalVariables: Record<string, string | undefined> = {};

  for (const [name, value] of Object.entries(testEnvironmentVariables)) {
    originalVariables[name] = process.env[name];
    process.env[name] = value;
  }
  return originalVariables;
});

describe(AppModule, () => {
  beforeAll(async() => {
    await ConfigModule.envVariablesLoaded;
  });

  afterAll(() => {
    for (const [name, value] of Object.entries(originalEnvironmentVariables)) {
      if (value === undefined) {
        Reflect.deleteProperty(process.env, name);
      } else {
        process.env[name] = value;
      }
    }
  });

  it("should register the global exception filter as an application filter when the module metadata is read.", () => {
    const reflector = new Reflector();

    expect(reflector.get("providers", AppModule)).toContainEqual({ provide: APP_FILTER, useClass: GlobalExceptionFilter });
  });

  it("should apply the localization middleware to every route when configured.", () => {
    const forRoutes = vi.fn<(route: string) => void>();
    const apply = vi.fn<(middleware: unknown) => { forRoutes: typeof forRoutes }>().mockReturnValue({ forRoutes });
    const appModule = new AppModule();

    appModule.configure({ apply } as never);

    expect(apply).toHaveBeenCalledExactlyOnceWith(LocalizationMiddleware);
  });

  it("should register the localization middleware for all routes when configured.", () => {
    const forRoutes = vi.fn<(route: string) => void>();
    const apply = vi.fn<(middleware: unknown) => { forRoutes: typeof forRoutes }>().mockReturnValue({ forRoutes });
    const appModule = new AppModule();

    appModule.configure({ apply } as never);

    expect(forRoutes).toHaveBeenCalledExactlyOnceWith("*");
  });
});