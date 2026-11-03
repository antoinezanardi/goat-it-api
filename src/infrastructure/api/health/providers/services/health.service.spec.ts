import { ServiceUnavailableException } from "@nestjs/common";
import { HealthCheckService, HttpHealthIndicator, MongooseHealthIndicator } from "@nestjs/terminus";
import { Test } from "@nestjs/testing";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";
import { HEALTH_CHECK_UNAVAILABLE_MESSAGE } from "@src/infrastructure/api/health/constants/health.constants";
import { HealthService } from "@src/infrastructure/api/health/providers/services/health.service";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";
import { createMockedTerminusHealthCheckService, createMockedTerminusHealthIndicatorService } from "@mocks/infrastructure/api/health/providers/services/terminus.service.mock";

import type { TestingModule } from "@nestjs/testing";

describe(HealthService, () => {
  let services: { health: HealthService };
  let mocks: {
    services: {
      health: ReturnType<typeof createMockedTerminusHealthCheckService>;
      mongooseHealth: ReturnType<typeof createMockedTerminusHealthIndicatorService>;
      docsHealth: ReturnType<typeof createMockedTerminusHealthIndicatorService>;
      appConfig: ReturnType<typeof createMockedAppConfigService>;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        health: createMockedTerminusHealthCheckService(),
        mongooseHealth: createMockedTerminusHealthIndicatorService(),
        docsHealth: createMockedTerminusHealthIndicatorService(),
        appConfig: createMockedAppConfigService({
          serverBaseUrl: "http://0.0.0.0:3000",
        }),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HealthCheckService,
          useValue: mocks.services.health,
        },
        {
          provide: MongooseHealthIndicator,
          useValue: mocks.services.mongooseHealth,
        },
        {
          provide: HttpHealthIndicator,
          useValue: mocks.services.docsHealth,
        },
        {
          provide: AppConfigService,
          useValue: mocks.services.appConfig,
        },
        HealthService,
      ],
    }).compile();

    services = { health: module.get<HealthService>(HealthService) };
  });

  describe(HealthService.prototype.checkAppHealth, () => {
    it("should call health check service when called.", async() => {
      await services.health.checkAppHealth();

      expect(mocks.services.health.check).toHaveBeenCalledExactlyOnceWith(expect.any(Array));
    });

    it("should call mongoose connection check for the first check when called.", async() => {
      await services.health.checkAppHealth();
      const mongooseHealthCheckFunction = mocks.services.health.check.mock.calls[0][0][0];
      await mongooseHealthCheckFunction();

      expect(mocks.services.mongooseHealth.pingCheck).toHaveBeenCalledOnce();
    });

    it("should call goat-it-docs health check for the second check when called.", async() => {
      await services.health.checkAppHealth();
      const docsHealthCheckFunction = mocks.services.health.check.mock.calls[0][0][1];
      await docsHealthCheckFunction();

      expect(mocks.services.docsHealth.pingCheck).toHaveBeenCalledOnce();
    });

    it("should throw a sanitized service unavailable exception when health check service throws a service unavailable exception.", async() => {
      mocks.services.health.check.mockRejectedValueOnce(new ServiceUnavailableException({
        status: "error",
        details: {
          "mongoose": { status: "down", message: "MongoDB connection refused" },
          "goat-it-docs": { status: "down", message: "Documentation endpoint unreachable" },
        },
      }));

      await expect(services.health.checkAppHealth()).rejects.toThrow(new ServiceUnavailableException(HEALTH_CHECK_UNAVAILABLE_MESSAGE));
    });

    it("should not expose health check details when health check service throws a service unavailable exception.", async() => {
      mocks.services.health.check.mockRejectedValueOnce(new ServiceUnavailableException({
        status: "error",
        details: {
          mongoose: { status: "down", message: "MongoDB connection refused" },
        },
      }));
      const expectedResponse = {
        statusCode: 503,
        message: HEALTH_CHECK_UNAVAILABLE_MESSAGE,
        error: "Service Unavailable",
      };

      await expect(services.health.checkAppHealth()).rejects.toHaveProperty("response", expectedResponse);
    });

    it("should rethrow error when health check service throws a non service unavailable exception.", async() => {
      const expectedError = new Error("Unexpected health check failure");
      mocks.services.health.check.mockRejectedValueOnce(expectedError);

      await expect(services.health.checkAppHealth()).rejects.toThrow(expectedError);
    });
  });

  // Acceptable as private method is accessed via bracket notation for symbol-based describe (U3/HP2).
  // oxlint-disable-next-line typescript/dot-notation
  describe(HealthService.prototype["checkMongooseConnection"], () => {
    it("should call ping check from mongoose health indicator when called.", async() => {
      await services.health["checkMongooseConnection"]();

      expect(mocks.services.mongooseHealth.pingCheck).toHaveBeenCalledExactlyOnceWith("mongoose");
    });
  });

  // Acceptable as private method is accessed via bracket notation for symbol-based describe (U3/HP2).
  // oxlint-disable-next-line typescript/dot-notation
  describe(HealthService.prototype["checkGoatItDocs"], () => {
    it("should call ping check from http health indicator when called.", async() => {
      await services.health["checkGoatItDocs"]();

      expect(mocks.services.docsHealth.pingCheck).toHaveBeenCalledExactlyOnceWith("goat-it-docs", "http://0.0.0.0:3000/docs");
    });
  });
});