import { timingSafeEqual, createHmac } from "node:crypto";

import { UnauthorizedException } from "@nestjs/common";

import { API_KEY_HEADER } from "@src/infrastructure/api/auth/constants/auth.constants";
import type { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";
import { InvalidApiKeyError, MissingApiKeyError } from "@src/infrastructure/api/auth/errors/auth.errors";

import type { ExecutionContext } from "@nestjs/common";

import type { AugmentedFastifyRequest } from "@shared/infrastructure/http/types/fastify/fastify.types";

/**
 * **SECURITY WARNING**:
 *
 * This function is only for hashing API keys for comparison purposes. Not for storing passwords.
 *
 * This is a high-entropy API token validated using HMAC-SHA256,
 * which is the recommended approach for server-side API key authentication.
 */
function hashApiKey(apiKey: string, hmacKey: string): string {
  return createHmac("sha256", hmacKey)
    .update(apiKey)
    .digest("hex");
}

function createApiKeyValidator(
  expectedHashedApiKey: string,
  hmacSecret: string,
): (receivedApiKey: unknown) => void {
  return function validate(receivedApiKey: unknown): void {
    validateReceivedApiKey(expectedHashedApiKey, receivedApiKey, hmacSecret);
  };
}

function validateReceivedApiKey(expectedHashedApiKey: string, receivedApiKey: unknown, hmacSecret: string): void {
  if (typeof receivedApiKey !== "string") {
    throw new MissingApiKeyError();
  }
  const receivedHashedApiKey = hashApiKey(receivedApiKey, hmacSecret);

  const expectedBuffer = Buffer.from(expectedHashedApiKey, "hex");
  const receivedBuffer = Buffer.from(receivedHashedApiKey, "hex");

  const areKeysSameLength = expectedBuffer.length === receivedBuffer.length;
  if (!areKeysSameLength) {
    throw new InvalidApiKeyError();
  }

  const areKeysMatching = timingSafeEqual(expectedBuffer, receivedBuffer);
  if (!areKeysMatching) {
    throw new InvalidApiKeyError();
  }
}

/**
 * This function handles the common logic for API key guards. It is used for both admin and game API key guards and only in those guards.
 */
function canActivateApiKeyGuardHandler(context: ExecutionContext, configService: AppConfigService, apiKeyAuthType: "admin" | "game"): boolean {
  const request = context.switchToHttp().getRequest<AugmentedFastifyRequest>();
  const receivedApiKey = request.headers[API_KEY_HEADER];
  const { game, admin } = configService.authenticationConfig;

  const validator = apiKeyAuthType === "admin" ? admin.apiKeyValidator : game.apiKeyValidator;
  try {
    validator(receivedApiKey);
  } catch(error) {
    const message = error instanceof Error ? error.message : "Unauthorized";

    throw new UnauthorizedException(message);
  }
  return true;
}

export {
  hashApiKey,
  createApiKeyValidator,
  validateReceivedApiKey,
  canActivateApiKeyGuardHandler,
};