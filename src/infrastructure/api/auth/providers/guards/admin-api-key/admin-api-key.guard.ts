import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";

import { API_KEY_HEADER } from "@src/infrastructure/api/auth/constants/auth.constants";
import { validateReceivedApiKey } from "@src/infrastructure/api/auth/helpers/auth.helpers";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import type { AugmentedFastifyRequest } from "@shared/infrastructure/http/types/fastify/fastify.types";

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  public constructor(private readonly configService: AppConfigService) {}

  public canActivate(context: ExecutionContext): true {
    const request = context.switchToHttp().getRequest<AugmentedFastifyRequest>();

    const receivedApiKey = request.headers[API_KEY_HEADER];
    const { apiKey: expectedAdminApiKey } = this.configService.authenticationConfig.admin;

    validateReceivedApiKey(expectedAdminApiKey, receivedApiKey);

    return true;
  }
}