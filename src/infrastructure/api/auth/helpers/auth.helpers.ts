import { timingSafeEqual, createHmac } from "node:crypto";

import { UnauthorizedException } from "@nestjs/common";

import { API_KEY_HEADER } from "@src/infrastructure/api/auth/constants/auth.constants";
import { InvalidApiKeyError, MissingApiKeyError } from "@src/infrastructure/api/auth/errors/auth.errors";
import type { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { getSecurityEventRoute, logAuthFailedEvent } from "@shared/infrastructure/helpers/security-events/security-events.helpers";

import type { ExecutionContext, LoggerService } from "@nestjs/common";

import type { AuthFailureReason } from "@shared/infrastructure/helpers/security-events/security-events.helpers.types";
import type { AugmentedFastifyRequest } from "@shared/infrastructure/http/types/fastify/fastify.types";

/**
 * Computes the HMAC-SHA256 hex digest used to compare API keys without keeping them in clear.
 *
 * This is keyed hashing for a high-entropy token, not a password-storage function.
 */
function hashApiKey(apiKey: string, hmacKey: string): string {
  return createHmac("sha256", hmacKey)
    .update(apiKey)
    .digest("hex");
}

/**
 * Binds the expected digest and secret into a validator, so callers cannot forget either argument.
 *
 * The returned validator completes normally when the key matches and throws the auth error when it does not.
 */
function createApiKeyValidator(
  expectedHashedApiKey: string,
  hmacSecret: string,
): (receivedApiKey: unknown) => void {
  return function validate(receivedApiKey: unknown): void {
    validateReceivedApiKey(expectedHashedApiKey, receivedApiKey, hmacSecret);
  };
}

/**
 * Re-hashes the received key and compares it to the expected digest in constant time.
 *
 * @throws `MissingApiKeyError` when the received key is not a string.
 * @throws `InvalidApiKeyError` when the digests differ in length or content.
 */
function validateReceivedApiKey(expectedHashedApiKey: string, receivedApiKey: unknown, hmacSecret: string): void {
  if (typeof receivedApiKey !== "string") {
    throw new MissingApiKeyError();
  }
  const receivedHashedApiKey = hashApiKey(receivedApiKey, hmacSecret);

  const expectedBuffer = Uint8Array.fromHex(expectedHashedApiKey);
  const receivedBuffer = Uint8Array.fromHex(receivedHashedApiKey);

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
 * Maps the validator failure to the allow-listed security-event reason.
 */
function getAuthFailureReason(error: unknown): AuthFailureReason {
  if (error instanceof MissingApiKeyError) {
    return "missing";
  }
  if (error instanceof InvalidApiKeyError) {
    return "invalid";
  }
  return "unknown";
}

/**
 * Validates the request API key against the admin or game validator selected by `apiKeyAuthType`.
 *
 * Returns `true` only when the key matches; a missing or invalid key emits `auth.failed` and becomes an `UnauthorizedException` (401), so the guard never returns `false` itself.
 *
 * @throws `UnauthorizedException` when the header is missing or the key does not match.
 */
function canActivateApiKeyGuardHandler(
  context: ExecutionContext,
  configService: AppConfigService,
  apiKeyAuthType: "admin" | "game",
  logger: LoggerService,
): boolean {
  const request = context.switchToHttp().getRequest<AugmentedFastifyRequest>();
  const receivedApiKey = request.headers[API_KEY_HEADER];
  const { game, admin } = configService.authenticationConfig;

  const validator = apiKeyAuthType === "admin" ? admin.apiKeyValidator : game.apiKeyValidator;
  try {
    validator(receivedApiKey);
  } catch(error) {
    const message = Error.isError(error) ? error.message : "Unauthorized";
    logAuthFailedEvent(logger, {
      route: getSecurityEventRoute(request),
      audience: apiKeyAuthType,
      reason: getAuthFailureReason(error),
    });

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