import { timingSafeEqual, createHmac } from "node:crypto";

import { InvalidApiKeyError, MissingApiKeyError } from "@src/infrastructure/api/auth/errors/auth.errors";

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

export {
  hashApiKey,
  createApiKeyValidator,
  validateReceivedApiKey,
};