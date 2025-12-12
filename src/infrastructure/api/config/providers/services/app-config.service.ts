import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { CorsConfigFromEnv, LocalizationConfigFromEnv, MongoDatabaseConfigFromEnv, ServerConfigFromEnv } from "@src/infrastructure/api/config/types/config.types";

@Injectable()
export class AppConfigService {
  public constructor(private readonly configService: ConfigService) {}

  public get serverConfig(): ServerConfigFromEnv {
    return {
      host: this.configService.getOrThrow<ServerConfigFromEnv["host"]>("SERVER_HOST"),
      port: this.configService.getOrThrow<ServerConfigFromEnv["port"]>("SERVER_PORT"),
    };
  }

  public get serverBaseUrl(): string {
    let serverHost = this.serverConfig.host;
    if (!serverHost.startsWith("http") && !serverHost.startsWith("https")) {
      serverHost = `http://${serverHost}`;
    }
    return `${serverHost}:${this.serverConfig.port}`;
  }

  public get corsConfig(): CorsConfigFromEnv {
    return {
      origin: this.configService.getOrThrow<CorsConfigFromEnv["origin"]>("CORS_ORIGIN"),
    };
  }

  public get mongoDbConfig(): MongoDatabaseConfigFromEnv {
    return {
      host: this.configService.getOrThrow<MongoDatabaseConfigFromEnv["host"]>("MONGODB_HOST"),
      port: this.configService.getOrThrow<MongoDatabaseConfigFromEnv["port"]>("MONGODB_PORT"),
      database: this.configService.getOrThrow<MongoDatabaseConfigFromEnv["database"]>("MONGODB_DATABASE"),
    };
  }

  public get localizationConfig(): LocalizationConfigFromEnv {
    return {
      fallbackLocale: this.configService.getOrThrow<LocalizationConfigFromEnv["fallbackLocale"]>("FALLBACK_LOCALE"),
    };
  }
}