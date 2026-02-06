import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";

import { SwaggerTags } from "@src/infrastructure/api/server/swagger/constants/swagger.enums";

import { AppMetadataDto } from "@app/dto/app-metadata/app-metadata.dto.shape";
import { AppMetadataNestZodDto } from "@app/dto/app-metadata/app-metadata.dto";
import { AppService } from "@app/providers/services/app.service";

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
    type: AppMetadataNestZodDto,
  })
  public getApiMetadata(): AppMetadataDto {
    return this.appService.getApiMeta();
  }
}