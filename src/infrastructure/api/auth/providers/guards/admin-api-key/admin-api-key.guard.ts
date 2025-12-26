import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { API_KEY_HEADER } from "@src/infrastructure/api/auth/constants/auth.constants";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import type { AugmentedFastifyRequest } from "@shared/infrastructure/http/types/fastify/fastify.types";

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  public constructor(private readonly configService: AppConfigService) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AugmentedFastifyRequest>();
    const receivedApiKey = request.headers[API_KEY_HEADER];

    try {
      this.configService.authenticationConfig.admin.apiKeyValidator(receivedApiKey);
    } catch(error) {
      const message = error instanceof Error ? error.message : "Unauthorized";

      throw new UnauthorizedException(message);
    }
    return true;
  }
}