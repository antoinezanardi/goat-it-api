import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import { ZodResponse } from "nestjs-zod";

import { SWAGGER_TAGS } from "@src/infrastructure/api/server/swagger/constants/swagger.constants";
import { THROTTLER_SKIPPED_TIERS } from "@src/infrastructure/api/server/throttler/constants/throttler.constants";

import { AppMetadataNestZodDto } from "@app/dto/app-metadata/app-metadata.dto";
import { AppService } from "@app/providers/services/app.service";

import type { AppMetadataDto } from "@app/dto/app-metadata/app-metadata.dto.shape";

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get()
  @SkipThrottle(THROTTLER_SKIPPED_TIERS)
  @ApiOperation({
    tags: [SWAGGER_TAGS.APP],
    summary: "Get application metadata",
    description: "Get the metadata information of the application like name, version, and description.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: AppMetadataNestZodDto,
  })
  public getApiMetadata(): AppMetadataDto {
    return this.appService.getApiMeta();
  }
}