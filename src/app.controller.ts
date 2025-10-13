import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  private getHello(): string {
    return "Hello World!";
  }
}