import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { createApiKeyValidator, hashApiKey } from "@src/infrastructure/api/auth/helpers/auth.helpers";

import { AuthenticationConfigFromEnv, CorsConfigFromEnv, LocalizationConfigFromEnv, MongoDatabaseConfigFromEnv, ServerConfigFromEnv } from "@src/infrastructure/api/config/types/config.types";

@Injectable()
export class AppConfigService {
  private readonly authenticationConfigCache: AuthenticationConfigFromEnv;

  public constructor(private readonly configService: ConfigService) {
    this.authenticationConfigCache = this.computeAuthenticationConfigCache();
    AppConfigService.deleteSensitiveEnvVariables();
  }

  public get serverConfig(): ServerConfigFromEnv {
    return {
      host: this.configService.getOrThrow<ServerConfigFromEnv["host"]>("SERVER_HOST"),
      port: this.configService.getOrThrow<ServerConfigFromEnv["port"]>("SERVER_PORT"),
    };
  }

  public get serverBaseUrl(): string {
    const { host, port } = this.serverConfig;
    const normalizedHost = host.startsWith("http://") || host.startsWith("https://") ? host : `http://${host}`;
    const url = new URL(normalizedHost);
    url.port = String(port);

    return url.origin;
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

  public get authenticationConfig(): AuthenticationConfigFromEnv {
    return this.authenticationConfigCache;
  }

  private static deleteSensitiveEnvVariables(): void {
    delete process.env.API_KEY_HMAC_SECRET;
    delete process.env.ADMIN_API_KEY;
    delete process.env.GAME_API_KEY;
  }

  private computeAuthenticationConfigCache(): AuthenticationConfigFromEnv {
    const hmacSecret = this.configService.getOrThrow<string>("API_KEY_HMAC_SECRET");
    const adminApiKey = this.configService.getOrThrow<string>("ADMIN_API_KEY");
    const gameApiKey = this.configService.getOrThrow<string>("GAME_API_KEY");

    const hashedAdminApiKey = hashApiKey(adminApiKey, hmacSecret);
    const hashedGameApiKey = hashApiKey(gameApiKey, hmacSecret);

    return {
      admin: {
        apiKeyValidator: createApiKeyValidator(hashedAdminApiKey, hmacSecret),
      },
      game: {
        apiKeyValidator: createApiKeyValidator(hashedGameApiKey, hmacSecret),
      },
    };
  }
}