import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";
import { createThrottlerModuleOptions } from "@src/infrastructure/api/server/throttler/helpers/throttler.helpers";
import { ApiThrottlerGuard } from "@src/infrastructure/api/server/throttler/providers/guards/api-throttler/api-throttler.guard";

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => createThrottlerModuleOptions(appConfigService.throttlerConfig),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiThrottlerGuard,
    },
  ],
})
export class ApiThrottlerModule {}