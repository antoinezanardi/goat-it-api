import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { createApiKeyValidator, hashApiKey } from "@src/infrastructure/api/auth/helpers/auth.helpers";

import type { AuthenticationConfigFromEnv, CorsConfigFromEnv, LocalizationConfigFromEnv, MongoDatabaseConfigFromEnv, ServerConfigFromEnv } from "@src/infrastructure/api/config/types/config.types";

/**
 * Single access point to the validated environment configuration.
 *
 * The constructor hashes the admin and game API keys once and caches the validators, then deletes `API_KEY_HMAC_SECRET`,
 * `ADMIN_API_KEY` and `GAME_API_KEY` from `process.env` so the raw secrets are no longer readable in the process.
 */
@Injectable()
export class AppConfigService {
  private readonly authenticationConfigCache: AuthenticationConfigFromEnv;

  public constructor(private readonly configService: ConfigService) {
    this.authenticationConfigCache = this.computeAuthenticationConfigCache();
    AppConfigService.removeSensitiveEnvVariables();
  }

  public get serverConfig(): ServerConfigFromEnv {
    return {
      host: this.configService.getOrThrow<ServerConfigFromEnv["host"]>("SERVER_HOST"),
      port: this.configService.getOrThrow<ServerConfigFromEnv["port"]>("SERVER_PORT"),
    };
  }

  /**
   * Returns the server origin, defaulting to an `http://` scheme when the configured host does not declare one.
   */
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

  /**
   * Returns the validators cached at construction, so API keys are only ever compared as HMAC-SHA256 hashes against the stored digests.
   */
  public get authenticationConfig(): AuthenticationConfigFromEnv {
    return this.authenticationConfigCache;
  }

  private static removeSensitiveEnvVariables(): void {
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