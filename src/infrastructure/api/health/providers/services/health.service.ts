import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { HealthCheckService, HttpHealthIndicator, MongooseHealthIndicator } from "@nestjs/terminus";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";
import { DOCS_ENDPOINT_HEALTH_KEY, HEALTH_CHECK_UNAVAILABLE_MESSAGE, MONGOOSE_HEALTH_KEY } from "@src/infrastructure/api/health/constants/health.constants";
import { getSwaggerUrl } from "@src/infrastructure/api/server/swagger/helpers/swagger.helpers";

import type { HealthCheckResult, HealthIndicatorResult } from "@nestjs/terminus";

/**
 * Runs the readiness probes exposed by the health endpoint: the Mongo connection and the Swagger documentation page.
 *
 * Both probes must pass; a failing probe becomes a 503 with a generic message so the response does not leak which dependency is down.
 */
@Injectable()
export class HealthService {
  public constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly mongoose: MongooseHealthIndicator,
    private readonly http: HttpHealthIndicator,
    private readonly appConfig: AppConfigService,
  ) {}

  /**
   * Runs every probe and returns their combined result.
   *
   * @throws `ServiceUnavailableException` when at least one probe fails, always with the same message; any other error is rethrown unchanged.
   */
  public async checkAppHealth(): Promise<HealthCheckResult> {
    try {
      return await this.healthCheckService.check([
        async() => this.checkMongooseConnection(),
        async() => this.checkGoatItDocs(),
      ]);
    } catch(error) {
      if (error instanceof ServiceUnavailableException) {
        throw new ServiceUnavailableException(HEALTH_CHECK_UNAVAILABLE_MESSAGE);
      }
      throw error;
    }
  }

  private async checkMongooseConnection(): Promise<HealthIndicatorResult<typeof MONGOOSE_HEALTH_KEY>> {
    return this.mongoose.pingCheck(MONGOOSE_HEALTH_KEY);
  }

  private async checkGoatItDocs(): Promise<HealthIndicatorResult<typeof DOCS_ENDPOINT_HEALTH_KEY>> {
    const documentationUrl = getSwaggerUrl(this.appConfig.serverBaseUrl);

    return this.http.pingCheck(DOCS_ENDPOINT_HEALTH_KEY, documentationUrl);
  }
}