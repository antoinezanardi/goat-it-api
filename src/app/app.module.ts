import { Module } from "@nestjs/common";
import { AppController } from "@app/app.controller";

@Module({
  imports: [],
  controllers: [AppController]
})
export class AppModule {}