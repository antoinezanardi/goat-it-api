import { Controller, Get } from "@nestjs/common";

import { APIMetadata } from "@app/types/app.types";
import { AppService } from "@app/providers/services/app.service";

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get()
  public getApiMetadata(): APIMetadata {
    return this.appService.getApiMeta();
  }
}