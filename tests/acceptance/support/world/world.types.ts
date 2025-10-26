import { World } from "@cucumber/cucumber";

import type { HttpExceptionBody } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { Response } from "light-my-request";

class CustomWorld extends World {
  public app!: NestFastifyApplication;

  public response!: Response;

  public responseException!: HttpExceptionBody;
}

export { CustomWorld };