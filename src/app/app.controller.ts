import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  public getHello(): string {
    void this;

    return "Hello World!";
  }
}