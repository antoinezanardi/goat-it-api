import { createHash } from "node:crypto";

function hashApiKey(apiKey: string): string {
  return createHash("sha256")
    .update(apiKey)
    .digest("hex");
}

function validateReceivedApiKey(expectedKey: string, receivedKey: unknown): void {
  if (typeof receivedKey !== "string") {
    throw new TypeError("Missing or invalid API key format");
  }

  if (hashApiKey(receivedKey) !== hashApiKey(expectedKey)) {
    throw new Error("Invalid API key");
  }
}

export {
  hashApiKey,
  validateReceivedApiKey,
};