import { Module } from "@nestjs/common";

import { AppService } from "@app/providers/services/app.service";
import { AppController } from "@app/controllers/app.controller";
import { AppConfigModule } from "@app/modules/config/config.module";

@Module({
  imports: [AppConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
