import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";

// oxlint-disable-next-line consistent-type-imports
import { AppService } from "@app/providers/services/app.service";

import { AppGetMetadataResponseDto } from "@app/types/app.types";

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: "Get application metadata",
    description: "Get the metadata information of the application like name, version, and description.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: AppGetMetadataResponseDto,
  })
  public getApiMetadata(): AppGetMetadataResponseDto {
    return this.appService.getApiMeta();
  }
}