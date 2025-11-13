import { Controller, Get } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { HealthCheck } from "@nestjs/terminus";

import type { HealthService } from "@modules/health/providers/services/health.service";
import { DOCS_ENDPOINT_HEALTH_KEY, MONGOOSE_HEALTH_KEY } from "@modules/health/constants/health.constants";

import type { HealthCheckResult } from "@nestjs/terminus";

@Controller("health")
export class HealthController {
  public constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: "Check application health",
    description: `Check the health status of the application by performing various checks on database and documentation endpoint.<br/>In response schema, \`info\`, \`error\` and \`details\` objects will have \`${MONGOOSE_HEALTH_KEY}\` and \`${DOCS_ENDPOINT_HEALTH_KEY}\` keys to indicate the health status of the respective services.`,
  })
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    return this.healthService.checkAppHealth();
  }
}