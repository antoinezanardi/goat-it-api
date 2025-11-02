/* eslint-disable vitest/no-conditional-in-test */
import * as NestCore from "@nestjs/core";
import * as Fastify from "@nestjs/platform-fastify";
import { Logger } from "nestjs-pino";
import { ConfigService } from "@nestjs/config";

import type { AppModule } from "@app/app.module";

import { bootstrap } from "@server/server";

import type { INestApplication, NestApplicationOptions } from "@nestjs/common";

vi.mock(import("@nestjs/core"));
vi.mock(import("@app/app.module"), () => ({
  AppModule: {
    name: "MockedModule",
  } as typeof AppModule,
}));

describe("Server", () => {
  let mockConfigService: {
    getOrThrow: ReturnType<typeof vi.fn>;
  };
  let mockLogger: {
    log: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockConfigService = {
      getOrThrow: vi.fn<(key: string) => string | number>().mockImplementation((key: string) => {
        if (key === "HOST") {
          return "0.0.0.0";
        }
        if (key === "PORT") {
          return 3000;
        }
        return "";
      }),
    };

    mockLogger = {
      log: vi.fn<() => void>(),
    };

    vi.mocked(NestCore.NestFactory.create, { partial: true }).mockResolvedValue({
      enableShutdownHooks: vi.fn<() => INestApplication>(),
      useLogger: vi.fn<() => void>(),
      get: vi.fn<(service: typeof ConfigService | typeof Logger) => object>().mockImplementation((service) => {
        if (service === ConfigService) {
          return mockConfigService;
        }
        if (service === Logger) {
          return mockLogger;
        }
        return {};
      }),
      listen: vi.fn<() => Promise<undefined>>(),
      getUrl: vi.fn<() => Promise<string>>().mockResolvedValue("http://mocked-host:9090"),
    } as Partial<INestApplication>);
  });

  describe(bootstrap, () => {
    it("should create from NestFactory when called.", async () => {
      const expectedOptions: NestApplicationOptions = {
        bufferLogs: true,
      };
      await bootstrap();

      expect(NestCore.NestFactory.create).toHaveBeenCalledExactlyOnceWith(
        { name: "MockedModule" },
        expect.any(Fastify.FastifyAdapter),
        expectedOptions
      );
    });

    it("should enable shutdown hooks when called.", async () => {
      const app = await bootstrap();

      expect(app.enableShutdownHooks).toHaveBeenCalledExactlyOnceWith();
    });

    it("should use logger when called.", async () => {
      const app = await bootstrap();

      expect(app.useLogger).toHaveBeenCalledExactlyOnceWith(mockLogger);
    });

    it("should listen on the default host and port when none are provided.", async () => {
      const app = await bootstrap();

      expect(app.listen).toHaveBeenCalledExactlyOnceWith({ host: "0.0.0.0", port: 3000 });
    });

    it("should listen on the provided host and port when they are provided.", async () => {
      mockConfigService.getOrThrow.mockImplementation((key: string) => {
        if (key === "HOST") {
          return "127.0.0.1";
        }
        if (key === "PORT") {
          return 8080;
        }
        return "";
      });

      const app = await bootstrap();

      expect(app.listen).toHaveBeenCalledExactlyOnceWith({ host: "127.0.0.1", port: 8080 });
    });

    it("should get app url when called.", async () => {
      const app = await bootstrap();

      expect(app.getUrl).toHaveBeenCalledExactlyOnceWith();
    });

    it("should log the app url when called.", async () => {
      await bootstrap();

      expect(mockLogger.log).toHaveBeenCalledExactlyOnceWith("🐐 Goat It API is running on: http://mocked-host:9090");
    });

    it("should return the app when called.", async () => {
      const app = await bootstrap();
      const expectedApp = {
        enableShutdownHooks: expect.any(Function) as () => INestApplication,
        useLogger: expect.any(Function) as () => void,
        get: expect.any(Function) as () => never,
        listen: expect.any(Function) as () => void,
        getUrl: expect.any(Function) as () => void,
      };

      expect(app).toStrictEqual(expectedApp);
    });
  });
});
