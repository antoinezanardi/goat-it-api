import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  public getHello(): string {
    return "Hello World!";
  }
}