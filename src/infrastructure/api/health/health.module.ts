import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { HealthService } from "@src/infrastructure/api/health/providers/services/health.service";
import { HealthController } from "@src/infrastructure/api/health/controllers/health.controller";

@Module({
  imports: [
    TerminusModule.forRoot(),
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}