import { Injectable } from "@nestjs/common";

import { DOCS_ENDPOINT_HEALTH_KEY, MONGOOSE_HEALTH_KEY } from "@modules/health/constants/health.constants";

import type { HealthCheckResult, HealthCheckService, HealthIndicatorResult, HttpHealthIndicator, MongooseHealthIndicator } from "@nestjs/terminus";

@Injectable()
export class HealthService {
  public constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly mongoose: MongooseHealthIndicator,
    private readonly http: HttpHealthIndicator,
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
    return this.http.pingCheck(DOCS_ENDPOINT_HEALTH_KEY, "http://127.0.0.1:3000/docs");
  }
}