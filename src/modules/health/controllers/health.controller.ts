import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { HealthCheck } from "@nestjs/terminus";
import { ZodResponse } from "nestjs-zod";

import { SwaggerTags } from "@server/constants/swagger.enums";

// oxlint-disable-next-line consistent-type-imports
import { HealthService } from "@modules/health/providers/services/health.service";
import { HEALTH_CHECK_RESULT_SCHEMA } from "@modules/health/constants/health.constants";

import { GetAppHealthCheckResultResponseDto } from "@modules/health/types/health.types";

@Controller("health")
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
    type: GetAppHealthCheckResultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: "Application is not ready yet",
  })
  public async check(): Promise<GetAppHealthCheckResultResponseDto> {
    const appHealth = await this.healthService.checkAppHealth();

    return HEALTH_CHECK_RESULT_SCHEMA.parse(appHealth);
  }
}