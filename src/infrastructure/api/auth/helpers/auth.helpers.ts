import { timingSafeEqual, createHmac } from "node:crypto";

import { InvalidApiKeyError, MissingApiKeyError } from "@src/infrastructure/api/auth/errors/auth.errors";

function hashApiKey(apiKey: string): string {
  return createHmac("sha256", "this_is_a_secret_salt")
    .update(apiKey)
    .digest("hex");
}

function validateReceivedApiKey(expectedHashedKey: string, receivedKey: unknown): void {
  if (typeof receivedKey !== "string") {
    throw new MissingApiKeyError();
  }
  const bufferedHashedExpectedKey = Buffer.from(expectedHashedKey);
  const bufferedHashedReceivedKey = Buffer.from(hashApiKey(receivedKey));

  const areKeysSameLength = bufferedHashedExpectedKey.length === bufferedHashedReceivedKey.length;
  const areKeysMatching = timingSafeEqual(bufferedHashedExpectedKey, bufferedHashedReceivedKey);

  if (!areKeysSameLength || !areKeysMatching) {
    throw new InvalidApiKeyError();
  }
}

export {
  hashApiKey,
  validateReceivedApiKey,
};