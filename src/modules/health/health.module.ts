import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { HealthService } from "@modules/health/providers/services/health.service";
import { HealthController } from "@modules/health/controllers/health.controller";

@Module({
  imports: [
    TerminusModule.forRoot(),
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}