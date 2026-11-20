import {
  Injectable,
} from "@nestjs/common";

import { canActivateApiKeyGuardHandler } from "@src/infrastructure/api/auth/helpers/auth.helpers";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import type {
  CanActivate,
  ExecutionContext,
} from "@nestjs/common";

/**
 * Rejects requests that do not carry the game `goat-it-api-key` header with a 401 Unauthorized.
 *
 * The game key is audience-specific: it cannot call admin routes.
 */
@Injectable()
export class GameApiKeyGuard implements CanActivate {
  public constructor(private readonly configService: AppConfigService) {}

  public canActivate(context: ExecutionContext): boolean {
    return canActivateApiKeyGuardHandler(context, this.configService, "game");
  }
}