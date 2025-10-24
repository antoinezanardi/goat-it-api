import { Module } from "@nestjs/common";

import { AppService } from "@app/providers/services/app.service";
import { AppController } from "@app/controllers/app.controller";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}