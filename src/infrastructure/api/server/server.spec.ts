import * as NestCore from "@nestjs/core";
import * as Fastify from "@nestjs/platform-fastify";
import { Logger } from "nestjs-pino";

import * as cacheHelpers from "@src/infrastructure/api/server/cache/helpers/cache.helpers";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";
import * as corsHelpers from "@src/infrastructure/api/server/cors/helpers/cors.helpers";
import * as fastifyHelpers from "@src/infrastructure/api/server/fastify/helpers/fastify.helpers";
import * as requestIdHelpers from "@src/infrastructure/api/server/request-id/helpers/request-id.helpers";
import * as securityHeadersHelpers from "@src/infrastructure/api/server/security-headers/helpers/security-headers.helpers";
import * as swaggerHelpers from "@src/infrastructure/api/server/swagger/helpers/swagger.helpers";
import { bootstrap } from "@src/infrastructure/api/server/server";

import { mockByRules } from "@unit-tests/utils/helpers/mock-by-rules.helpers";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";
import { getMockedLoggerInstance } from "@mocks/shared/nest/nest.mock";

import { createFakeCorsConfigFromEnv, createFakeServerConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";
import { createFakeCorsConfig } from "@faketories/infrastructure/api/server/cors/cors.faketory";

import type { INestApplication, NestApplicationOptions } from "@nestjs/common";

const TRUST_PROXY_FROM_ENV = "127.0.0.1";

vi.mock(import("@nestjs/core"));

class MockedAppModule {}

describe(bootstrap, () => {
  let mocks: {
    services: {
      config: ReturnType<typeof createMockedAppConfigService>;
    };
  };

  beforeEach(() => {
    mocks = {
      services: {
        config: createMockedAppConfigService({
          serverConfig: createFakeServerConfigFromEnv({
            host: "0.0.0.0",
            port: 3000,
          }),
          corsConfig: createFakeCorsConfigFromEnv({
            origin: "*",
          }),
        }),
      },
    };

    vi.spyOn(cacheHelpers, "setupResponseCachePolicy").mockReturnValue(undefined);
    vi.spyOn(corsHelpers, "createCorsConfig");
    vi.spyOn(fastifyHelpers, "createFastifyAdapter");
    vi.spyOn(securityHeadersHelpers, "setupSecurityHeaders").mockReturnValue(undefined);
    vi.spyOn(securityHeadersHelpers, "setupSecurityHeadersRequestHook").mockReturnValue(undefined);
    vi.spyOn(requestIdHelpers, "setupRequestIdHooks").mockReturnValue(undefined);
    vi.spyOn(swaggerHelpers, "getSwaggerUrl");
    vi.spyOn(swaggerHelpers, "setupSwaggerModule").mockReturnValue(undefined);

    vi.mocked(NestCore.NestFactory.create, { partial: true }).mockResolvedValue({
      enableShutdownHooks: vi.fn<() => INestApplication>(),
      useLogger: vi.fn<() => void>(),
      get: vi.fn<(service: typeof AppConfigService | typeof Logger) => object>().mockImplementation(mockByRules<typeof AppConfigService | typeof Logger, object>(
        [
          [AppConfigService, mocks.services.config],
          [Logger, getMockedLoggerInstance()],
        ],
        {},
      )),
      listen: vi.fn<() => Promise<undefined>>(),
      getUrl: vi.fn<() => Promise<string>>().mockResolvedValue("http://mocked-host:9090"),
      enableCors: vi.fn<() => INestApplication>(),
    } as Partial<INestApplication>);
  });

  it("should create from NestFactory when called.", async() => {
    const expectedOptions: NestApplicationOptions = {
      bufferLogs: true,
      bodyParser: false,
    };
    await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(NestCore.NestFactory.create).toHaveBeenCalledExactlyOnceWith(
      MockedAppModule,
      expect.any(Fastify.FastifyAdapter),
      expectedOptions,
    );
  });

  it("should create the Fastify adapter from the fastify helpers when called.", async() => {
    await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(fastifyHelpers.createFastifyAdapter).toHaveBeenCalledExactlyOnceWith(TRUST_PROXY_FROM_ENV);
  });

  it("should setup the security headers request hook with the fastify adapter instance when called.", async() => {
    const fastifyAdapter = new Fastify.FastifyAdapter();
    vi.mocked(fastifyHelpers.createFastifyAdapter).mockReturnValue(fastifyAdapter);
    await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(securityHeadersHelpers.setupSecurityHeadersRequestHook).toHaveBeenCalledExactlyOnceWith(fastifyAdapter.getInstance());
  });

  it("should setup the security headers request hook before creating the application when called.", async() => {
    await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(vi.mocked(securityHeadersHelpers.setupSecurityHeadersRequestHook).mock.invocationCallOrder[0])
      .toBeLessThan(vi.mocked(NestCore.NestFactory.create).mock.invocationCallOrder[0]);
  });

  it("should setup the request id hooks with the fastify adapter instance when called.", async() => {
    const fastifyAdapter = new Fastify.FastifyAdapter();
    vi.mocked(fastifyHelpers.createFastifyAdapter).mockReturnValue(fastifyAdapter);
    await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(requestIdHelpers.setupRequestIdHooks).toHaveBeenCalledExactlyOnceWith(fastifyAdapter.getInstance());
  });

  it("should setup the request id hooks before creating the application when called.", async() => {
    await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(vi.mocked(requestIdHelpers.setupRequestIdHooks).mock.invocationCallOrder[0])
      .toBeLessThan(vi.mocked(NestCore.NestFactory.create).mock.invocationCallOrder[0]);
  });

  it("should create cors config from configuration when called.", async() => {
    const corsConfigFromEnv = createFakeCorsConfigFromEnv({
      origin: "*",
    });
    await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(corsHelpers.createCorsConfig).toHaveBeenCalledExactlyOnceWith(corsConfigFromEnv);
  });

  it("should enable cors when called.", async() => {
    const expectedCorsConfig = createFakeCorsConfig({
      origin: "*",
      credentials: false,
      methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["X-Request-Id"],
    });
    vi.mocked(corsHelpers.createCorsConfig).mockReturnValue(expectedCorsConfig);
    const app = await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(app.enableCors).toHaveBeenCalledExactlyOnceWith(expectedCorsConfig);
  });

  it("should enable shutdown hooks when called.", async() => {
    const app = await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(app.enableShutdownHooks).toHaveBeenCalledExactlyOnceWith();
  });

  it("should use logger when called.", async() => {
    const app = await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);
    const mockLogger = getMockedLoggerInstance();

    expect(app.useLogger).toHaveBeenCalledExactlyOnceWith(mockLogger);
  });

  it("should setup swagger module when called.", async() => {
    await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(swaggerHelpers.setupSwaggerModule).toHaveBeenCalledExactlyOnceWith(expect.any(Object));
  });

  it("should setup the security headers when called.", async() => {
    const app = await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(securityHeadersHelpers.setupSecurityHeaders).toHaveBeenCalledExactlyOnceWith(app);
  });

  it("should setup the response cache policy when called.", async() => {
    const app = await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(cacheHelpers.setupResponseCachePolicy).toHaveBeenCalledExactlyOnceWith(app);
  });

  it("should setup the security headers before the swagger module when called.", async() => {
    await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(vi.mocked(securityHeadersHelpers.setupSecurityHeaders).mock.invocationCallOrder[0])
      .toBeLessThan(vi.mocked(swaggerHelpers.setupSwaggerModule).mock.invocationCallOrder[0]);
  });

  it("should setup the response cache policy before the swagger module when called.", async() => {
    await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(vi.mocked(cacheHelpers.setupResponseCachePolicy).mock.invocationCallOrder[0])
      .toBeLessThan(vi.mocked(swaggerHelpers.setupSwaggerModule).mock.invocationCallOrder[0]);
  });

  it.each<{
    test: string;
    serverConfig: ReturnType<typeof createFakeServerConfigFromEnv>;
    expected: ReturnType<typeof createFakeServerConfigFromEnv>;
  }>([
    {
      test: "should listen on the default host and port when none are provided.",
      serverConfig: createFakeServerConfigFromEnv({ host: "0.0.0.0", port: 3000 }),
      expected: { host: "0.0.0.0", port: 3000 },
    },
    {
      test: "should listen on the provided host and port when they are provided.",
      serverConfig: createFakeServerConfigFromEnv({ host: "127.0.0.1", port: 8080 }),
      expected: { host: "127.0.0.1", port: 8080 },
    },
  ])("$test", async({ serverConfig, expected }) => {
    mocks.services.config.serverConfig = serverConfig;

    const app = await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(app.listen).toHaveBeenCalledExactlyOnceWith(expected);
  });

  it("should get app url when called.", async() => {
    const app = await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(app.getUrl).toHaveBeenCalledExactlyOnceWith();
  });

  it("should get swagger url when called.", async() => {
    await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(swaggerHelpers.getSwaggerUrl).toHaveBeenCalledExactlyOnceWith("http://mocked-host:9090");
  });

  it("should log the app url when called.", async() => {
    const app = await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(app.get(Logger).log).toHaveBeenNthCalledWith(1, "🐐 Goat It API is running on: http://mocked-host:9090");
  });

  it("should log the swagger documentation path when called.", async() => {
    vi.mocked(swaggerHelpers.getSwaggerUrl).mockReturnValue("http://mocked-host:9090/docs");
    const app = await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);

    expect(app.get(Logger).log).toHaveBeenNthCalledWith(2, "📚 Swagger documentation is available on: http://mocked-host:9090/docs");
  });

  it("should return the app when called.", async() => {
    const app = await bootstrap(MockedAppModule, TRUST_PROXY_FROM_ENV);
    const expectedApp = {
      enableCors: expect.any(Function) as () => INestApplication,
      enableShutdownHooks: expect.any(Function) as () => INestApplication,
      useLogger: expect.any(Function) as () => void,
      get: expect.any(Function) as () => never,
      listen: expect.any(Function) as () => void,
      getUrl: expect.any(Function) as () => void,
    };

    expect(app).toStrictEqual(expectedApp);
  });
});