import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

import { API_KEY_HEADER } from "@src/infrastructure/api/auth/constants/auth.constants";
import { validateReceivedApiKey } from "@src/infrastructure/api/auth/helpers/auth.helpers";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import type { AugmentedFastifyRequest } from "@shared/infrastructure/http/types/fastify/fastify.types";

@Injectable()
export class GameApiKeyGuard implements CanActivate {
  public constructor(private readonly configService: AppConfigService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AugmentedFastifyRequest>();

    const receivedApiKey = request.headers[API_KEY_HEADER];
    const { apiKey: expectedGameApiKey } = this.configService.authenticationConfig.game;

    try {
      await validateReceivedApiKey(expectedGameApiKey, receivedApiKey);
    } catch(error) {
      throw new UnauthorizedException(error);
    }
    return true;
  }
}