/* oxlint-disable jest/no-conditional-in-test */
import * as NestCore from "@nestjs/core";
import * as Fastify from "@nestjs/platform-fastify";
import { Logger } from "nestjs-pino";
import { ConfigService } from "@nestjs/config";

import { createCorsConfig } from "@src/infrastructure/api/server/cors/helpers/cors.helpers";
import { setupSwaggerModule } from "@src/infrastructure/api/server/swagger/helpers/swagger.helpers";
import { bootstrap } from "@src/infrastructure/api/server/server";

import type { AppModule } from "@app/app.module";

import { getMockedLoggerInstance } from "@mocks/shared/nest/nest.mock";
import { createMockedAppConfigService } from "@mocks/app/providers/services/config.service.mock";

import { createFakeCorsConfig } from "@factories/infrastructure/api/server/cors/cors.factory";

import type { INestApplication, NestApplicationOptions } from "@nestjs/common";

vi.mock(import("@nestjs/core"));
vi.mock(import("@app/app.module"), () => ({
  AppModule: {
    name: "MockedModule",
  } as typeof AppModule,
}));
vi.mock(import("@src/infrastructure/api/server/swagger/helpers/swagger.helpers"));
vi.mock(import("@src/infrastructure/api/server/cors/helpers/cors.helpers"));

describe("Server", () => {
  let mocks: {
    services: {
      config: ReturnType<typeof createMockedAppConfigService>;
    };
  };

  beforeEach(() => {
    mocks = {
      services: {
        config: createMockedAppConfigService({
          HOST: "0.0.0.0",
          PORT: 3000,
        }),
      },
    };

    vi.mocked(NestCore.NestFactory.create, { partial: true }).mockResolvedValue({
      enableShutdownHooks: vi.fn<() => INestApplication>(),
      useLogger: vi.fn<() => void>(),
      get: vi.fn<(service: typeof ConfigService | typeof Logger) => object>().mockImplementation(service => {
        if (service === ConfigService) {
          return mocks.services.config;
        }
        if (service === Logger) {
          return getMockedLoggerInstance();
        }
        return {};
      }),
      listen: vi.fn<() => Promise<undefined>>(),
      getUrl: vi.fn<() => Promise<string>>().mockResolvedValue("http://mocked-host:9090"),
      useStaticAssets: vi.fn<() => void>(),
      enableCors: vi.fn<() => INestApplication>(),
    } as Partial<INestApplication>);
  });

  describe(bootstrap, () => {
    it("should create from NestFactory when called.", async() => {
      const expectedOptions: NestApplicationOptions = {
        bufferLogs: true,
      };
      await bootstrap();

      expect(NestCore.NestFactory.create).toHaveBeenCalledExactlyOnceWith(
        { name: "MockedModule" },
        expect.any(Fastify.FastifyAdapter),
        expectedOptions,
      );
    });

    it("should enable cors when called.", async() => {
      const expectedCorsConfig = createFakeCorsConfig({
        origin: "*",
        credentials: false,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      });
      vi.mocked(createCorsConfig).mockReturnValue(expectedCorsConfig);
      const app = await bootstrap();

      expect(app.enableCors).toHaveBeenCalledExactlyOnceWith(expectedCorsConfig);
    });

    it("should enable shutdown hooks when called.", async() => {
      const app = await bootstrap();

      expect(app.enableShutdownHooks).toHaveBeenCalledExactlyOnceWith();
    });

    it("should use logger when called.", async() => {
      const app = await bootstrap();
      const mockLogger = getMockedLoggerInstance();

      expect(app.useLogger).toHaveBeenCalledExactlyOnceWith(mockLogger);
    });

    it("should setup swagger module when called.", async() => {
      await bootstrap();

      expect(setupSwaggerModule).toHaveBeenCalledExactlyOnceWith(expect.any(Object));
    });

    it("should use static assets when called.", async() => {
      const app = await bootstrap();

      expect(app.useStaticAssets).toHaveBeenCalledExactlyOnceWith({
        root: `${process.cwd()}/public`,
        prefix: "/public/",
      });
    });

    it("should listen on the default host and port when none are provided.", async() => {
      const app = await bootstrap();

      expect(app.listen).toHaveBeenCalledExactlyOnceWith({ host: "0.0.0.0", port: 3000 });
    });

    it("should listen on the provided host and port when they are provided.", async() => {
      mocks.services.config = createMockedAppConfigService({
        HOST: "127.0.0.1",
        PORT: 8080,
      });

      const app = await bootstrap();

      expect(app.listen).toHaveBeenCalledExactlyOnceWith({ host: "127.0.0.1", port: 8080 });
    });

    it("should get app url when called.", async() => {
      const app = await bootstrap();

      expect(app.getUrl).toHaveBeenCalledExactlyOnceWith();
    });

    it("should log the app url when called.", async() => {
      const app = await bootstrap();

      expect(app.get(Logger).log).toHaveBeenNthCalledWith(1, "🐐 Goat It API is running on: http://mocked-host:9090");
    });

    it("should log the swagger documentation path when called.", async() => {
      const app = await bootstrap();

      expect(app.get(Logger).log).toHaveBeenNthCalledWith(2, "📚 Swagger documentation is available on: http://mocked-host:9090/docs");
    });

    it("should return the app when called.", async() => {
      const app = await bootstrap();
      const expectedApp = {
        enableCors: expect.any(Function) as () => INestApplication,
        enableShutdownHooks: expect.any(Function) as () => INestApplication,
        useLogger: expect.any(Function) as () => void,
        get: expect.any(Function) as () => never,
        listen: expect.any(Function) as () => void,
        getUrl: expect.any(Function) as () => void,
        useStaticAssets: expect.any(Function) as () => void,
      };

      expect(app).toStrictEqual(expectedApp);
    });
  });
});