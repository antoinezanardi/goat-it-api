import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";

import { SwaggerTags } from "@src/infrastructure/api/server/swagger/constants/swagger.enums";

import { AppService } from "@app/providers/services/app.service";

import { GetAppMetadataResponseDto } from "@app/types/app.types";

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    tags: [SwaggerTags.APP],
    summary: "Get application metadata",
    description: "Get the metadata information of the application like name, version, and description.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: GetAppMetadataResponseDto,
  })
  public getApiMetadata(): GetAppMetadataResponseDto {
    return this.appService.getApiMeta();
  }
}