import { Controller, Get } from "@nestjs/common";

import { AppService } from "@app/providers/services/app.service";

import type { APIMetadata } from "@app/types/app.types";

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get()
  public getApiMetadata(): APIMetadata {
    return this.appService.getApiMeta();
  }
}