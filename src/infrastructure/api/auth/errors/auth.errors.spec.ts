import { InvalidApiKeyError, MissingApiKeyError } from "@src/infrastructure/api/auth/errors/auth.errors";

describe("Auth Errors", () => {
  describe(MissingApiKeyError, () => {
    it("should have name MissingApiKeyError when created.", () => {
      const error = new MissingApiKeyError();

      expect(error.name).toBe("MissingApiKeyError");
    });

    it("should have correct message when created.", () => {
      const error = new MissingApiKeyError();

      expect(error.message).toBe("Missing API key in headers");
    });
  });

  describe(InvalidApiKeyError, () => {
    it("should have name InvalidApiKeyError when created.", () => {
      const error = new InvalidApiKeyError();

      expect(error.name).toBe("InvalidApiKeyError");
    });

    it("should have correct message when created.", () => {
      const error = new InvalidApiKeyError();

      expect(error.message).toBe("Invalid API key");
    });
  });
});