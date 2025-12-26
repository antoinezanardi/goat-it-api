import { hashApiKey, validateReceivedApiKey } from "@src/infrastructure/api/auth/helpers/auth.helpers";

describe("Auth Helpers", () => {
  describe(hashApiKey, () => {
    it("should hash the API key when called.", () => {
      const apiKey = "my-secret-api";
      const expectedHashedKey = "3d2437e09b228ca01f1b491dc935d43dad0563ab0e8bbe67b09fa8df6302e160";

      expect(hashApiKey(apiKey)).toBe(expectedHashedKey);
    });
  });

  describe(validateReceivedApiKey, () => {
    it("should throw error when received key is not a string.", () => {
      const expectedKey = "my-secret-api";
      const expectedError = new TypeError("Missing or invalid API key format");

      expect(() => validateReceivedApiKey(expectedKey, undefined)).toThrowError(expectedError);
    });

    it("should throw error when received key does not match expected key.", () => {
      const expectedKey = "my-secret-api";
      const receivedKey = "invalid-api-key";
      const expectedError = new Error("Invalid API key");

      expect(() => validateReceivedApiKey(expectedKey, receivedKey)).toThrowError(expectedError);
    });

    it("should not throw error when received key matches expected key.", () => {
      const expectedKey = "my-secret-api";
      const receivedKey = "my-secret-api";

      expect(() => validateReceivedApiKey(expectedKey, receivedKey)).not.toThrowError();
    });
  });
});