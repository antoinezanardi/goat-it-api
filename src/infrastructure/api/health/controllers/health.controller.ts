import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { HealthCheck } from "@nestjs/terminus";
import { ZodResponse } from "nestjs-zod";

import { AppHealthDto } from "@src/infrastructure/api/health/dto/app-health/app-health.dto.shape";
import { AppHealthNestZodDto } from "@src/infrastructure/api/health/dto/app-health/app-health.dto";
import { createAppHealthDtoFromHealthCheckResult } from "@src/infrastructure/api/health/mappers/health.mappers";
import { HealthService } from "@src/infrastructure/api/health/providers/services/health.service";
import { SwaggerTags } from "@src/infrastructure/api/server/swagger/constants/swagger.enums";

import { ControllerPrefixes } from "@shared/infrastructure/http/controllers/controllers.enums";

@Controller(ControllerPrefixes.HEALTH)
export class HealthController {
  public constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    tags: [SwaggerTags.APP],
    summary: "Check application health",
    description: `Check the health status of the application by performing various checks on database and documentation endpoint.`,
  })
  @HealthCheck({ swaggerDocumentation: false })
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