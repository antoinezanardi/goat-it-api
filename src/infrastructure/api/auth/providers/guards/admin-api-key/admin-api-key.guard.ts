import {
  Injectable,
} from "@nestjs/common";

import { canActivateApiKeyGuardHandler } from "@src/infrastructure/api/auth/helpers/auth.helpers";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import type {
  CanActivate,
  ExecutionContext,
} from "@nestjs/common";

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  public constructor(private readonly configService: AppConfigService) {}

  public canActivate(context: ExecutionContext): boolean {
    return canActivateApiKeyGuardHandler(context, this.configService, "admin");
  }
}