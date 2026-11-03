import { ConfigModule } from "@nestjs/config";

import { AppModule } from "@app/app.module";

import { LocalizationMiddleware } from "@shared/infrastructure/http/middlewares/localization/localization.middleware";

vi.hoisted(() => {
  process.env.SERVER_HOST = "0.0.0.0";
  process.env.SERVER_PORT = "4242";
  process.env.CORS_ORIGIN = "*";
  process.env.MONGODB_HOST = "0.0.0.0";
  process.env.MONGODB_PORT = "27017";
  process.env.MONGODB_DATABASE = "goat-it-test";
  process.env.FALLBACK_LOCALE = "en";
  process.env.API_KEY_HMAC_SECRET = "test_hmac_secret_key_for_api_key_signing_1234";
  process.env.ADMIN_API_KEY = "test_admin_api_key_for_testing";
  process.env.GAME_API_KEY = "test_game_api_key_for_testing";
});

describe(AppModule, () => {
  beforeAll(async() => {
    await ConfigModule.envVariablesLoaded;
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