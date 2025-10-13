import { Module } from '@nestjs/common';
import { AppController } from '@src/app.controller';

@Module({
  imports: [],
  controllers: [AppController]
})
export class AppModule {}