import { Controller, Get } from "@nestjs/common";

import { AppService } from "@app/providers/services/app.service";

import type { AppMetadata } from "@app/types/app.types";

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get()
  public getApiMetadata(): AppMetadata {
    return this.appService.getApiMeta();
  }
}