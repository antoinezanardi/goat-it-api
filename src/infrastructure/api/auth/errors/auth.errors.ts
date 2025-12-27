class MissingApiKeyError extends Error {
  public constructor() {
    super("Missing API key in headers");
    this.name = "MissingApiKeyError";
  }
}

class InvalidApiKeyError extends Error {
  public constructor() {
    super("Invalid API key");
    this.name = "InvalidApiKeyError";
  }
}

export {
  MissingApiKeyError,
  InvalidApiKeyError,
};