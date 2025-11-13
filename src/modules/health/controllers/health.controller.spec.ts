import { Test } from "@nestjs/testing";

import { HealthController } from "@modules/health/controllers/health.controller";
import { HealthService } from "@modules/health/providers/services/health.service";

import { createMockedHealthService } from "@mocks/modules/health/providers/services/health.service.mock";

import { createFakeHealthIndicatorResult } from "@factories/modules/health/health.factory";

import type { HealthCheckResult } from "@nestjs/terminus";

describe("Health Controller", () => {
  let healthController: HealthController;
  let mocks: {
    services: {
      health: ReturnType<typeof createMockedHealthService>;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        health: createMockedHealthService(),
      },
    };
    const testingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mocks.services.health,
        },
      ],
    }).compile();

    healthController = testingModule.get<HealthController>(HealthController);
  });

  describe(HealthController.prototype.check, () => {
    it("should check health from service when called.", async() => {
      await healthController.check();

      expect(mocks.services.health.checkAppHealth).toHaveBeenCalledExactlyOnceWith();
    });

    it("should return health check result without error and info fields when called.", async() => {
      const expectedHealthCheckResult: HealthCheckResult = {
        status: "ok",
        details: createFakeHealthIndicatorResult(),
      };
      mocks.services.health.checkAppHealth.mockResolvedValue(expectedHealthCheckResult);
      const actualHealthCheckResult = await healthController.check();

      expect(actualHealthCheckResult).toStrictEqual<HealthCheckResult>(expectedHealthCheckResult);
    });
  });
});