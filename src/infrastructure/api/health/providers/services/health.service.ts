import { Injectable } from "@nestjs/common";
import { HealthCheckService, HttpHealthIndicator, MongooseHealthIndicator } from "@nestjs/terminus";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";
import { DOCS_ENDPOINT_HEALTH_KEY, MONGOOSE_HEALTH_KEY } from "@src/infrastructure/api/health/constants/health.constants";
import { getSwaggerUrl } from "@src/infrastructure/api/server/swagger/helpers/swagger.helpers";

import type { HealthCheckResult, HealthIndicatorResult } from "@nestjs/terminus";

@Injectable()
export class HealthService {
  public constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly mongoose: MongooseHealthIndicator,
    private readonly http: HttpHealthIndicator,
    private readonly appConfig: AppConfigService,
  ) {}

  public async checkAppHealth(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      async() => this.checkMongooseConnection(),
      async() => this.checkGoatItDocs(),
    ]);
  }

  private async checkMongooseConnection(): Promise<HealthIndicatorResult<typeof MONGOOSE_HEALTH_KEY>> {
    return this.mongoose.pingCheck(MONGOOSE_HEALTH_KEY);
  }

  private async checkGoatItDocs(): Promise<HealthIndicatorResult<typeof DOCS_ENDPOINT_HEALTH_KEY>> {
    const docsUrl = getSwaggerUrl(this.appConfig.serverBaseUrl);

    return this.http.pingCheck(DOCS_ENDPOINT_HEALTH_KEY, "http://127.0.0.1:4000/docs");
  }
}