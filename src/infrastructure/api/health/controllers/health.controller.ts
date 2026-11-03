import { Controller, Get, Header, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";

import type { AppHealthDto } from "@src/infrastructure/api/health/dto/app-health/app-health.dto.shape";
import { AppHealthNestZodDto } from "@src/infrastructure/api/health/dto/app-health/app-health.dto";
import { HEALTH_CACHE_CONTROL_VALUE } from "@src/infrastructure/api/health/constants/health.constants";
import { createAppHealthDtoFromHealthCheckResult } from "@src/infrastructure/api/health/mappers/health.mappers";
import { HealthService } from "@src/infrastructure/api/health/providers/services/health.service";
import { SWAGGER_TAGS } from "@src/infrastructure/api/server/swagger/constants/swagger.constants";

import { ControllerPrefixes } from "@shared/infrastructure/http/controllers/controllers.enums";

@Controller(ControllerPrefixes.HEALTH)
export class HealthController {
  public constructor(private readonly healthService: HealthService) {}

  @Get()
  @Header("Cache-Control", HEALTH_CACHE_CONTROL_VALUE)
  @ApiOperation({
    tags: [SWAGGER_TAGS.APP],
    summary: "Check application health",
    description: "Check the readiness of the application by pinging the database and the documentation endpoint.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    description: "Application is healthy and ready to serve requests",
    type: AppHealthNestZodDto,
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: "Application is not ready yet",
  })
  public async check(): Promise<AppHealthDto> {
    const healthCheckResult = await this.healthService.checkAppHealth();

    return createAppHealthDtoFromHealthCheckResult(healthCheckResult);
  }
}