import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  private getHello(): string {
    return "Hello World!";
  }
}