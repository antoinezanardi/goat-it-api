import { hash, compare } from "bcrypt";

import { InvalidApiKeyError, MissingApiKeyError } from "@src/infrastructure/api/auth/errors/auth.errors";

async function hashApiKey(apiKey: string): Promise<string> {
  const saltRounds = 12;

  return hash(apiKey, saltRounds);
}

async function validateReceivedApiKey(expectedKey: string, receivedKey: unknown): Promise<void> {
  if (typeof receivedKey !== "string") {
    throw new MissingApiKeyError();
  }
  const [hashedExpectedKey, hashedReceivedKey] = await Promise.all([
    hashApiKey(expectedKey),
    hashApiKey(receivedKey),
  ]);
  const areKeysMatching = await compare(hashedExpectedKey, hashedReceivedKey);

  if (!areKeysMatching) {
    throw new InvalidApiKeyError();
  }
}

export {
  hashApiKey,
  validateReceivedApiKey,
};