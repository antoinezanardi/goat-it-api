import { HealthCheckService, HttpHealthIndicator, MongooseHealthIndicator } from "@nestjs/terminus";
import { Test } from "@nestjs/testing";

import { HealthService } from "@src/infrastructure/api/health/providers/services/health.service";

import { createMockedTerminusHealthCheckService, createMockedTerminusHealthIndicatorService } from "@mocks/infrastructure/api/health/providers/services/terminus.service.mock";

import type { TestingModule } from "@nestjs/testing";

describe("Health Service", () => {
  let services: { health: HealthService };
  let mocks: {
    services: {
      health: ReturnType<typeof createMockedTerminusHealthCheckService>;
      mongooseHealth: ReturnType<typeof createMockedTerminusHealthIndicatorService>;
      docsHealth: ReturnType<typeof createMockedTerminusHealthIndicatorService>;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        health: createMockedTerminusHealthCheckService(),
        mongooseHealth: createMockedTerminusHealthIndicatorService(),
        docsHealth: createMockedTerminusHealthIndicatorService(),
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
  });

  describe("checkMongooseConnection", () => {
    it("should call ping check from mongoose health indicator when called.", async() => {
      await services.health["checkMongooseConnection"]();

      expect(mocks.services.mongooseHealth.pingCheck).toHaveBeenCalledExactlyOnceWith("mongoose");
    });
  });

  describe("checkGoatItDocs", () => {
    it("should call ping check from http health indicator when called.", async() => {
      await services.health["checkGoatItDocs"]();

      expect(mocks.services.docsHealth.pingCheck).toHaveBeenCalledExactlyOnceWith("goat-it-docs", "http://127.0.0.1:3000/docs");
    });
  });
});