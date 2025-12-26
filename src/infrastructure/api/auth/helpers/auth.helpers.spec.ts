import { compare, hash } from "bcrypt";

import { InvalidApiKeyError, MissingApiKeyError } from "@src/infrastructure/api/auth/errors/auth.errors";
import { hashApiKey, validateReceivedApiKey } from "@src/infrastructure/api/auth/helpers/auth.helpers";

vi.mock(import("bcrypt"));

describe("Auth Helpers", () => {
  describe(hashApiKey, () => {
    it("should call bcrypt hash with correct parameters when called.", async() => {
      const apiKey = "my-secret-api";
      const saltRounds = 12;
      await hashApiKey(apiKey);

      expect(vi.mocked(hash)).toHaveBeenCalledExactlyOnceWith(apiKey, saltRounds);
    });
  });

  describe(validateReceivedApiKey, () => {
    beforeEach(() => {
      // @ts-expect-error: Hash types are not correctly inferred
      vi.mocked(hash).mockResolvedValue("hashed-value");
      // @ts-expect-error: Hash types are not correctly inferred
      vi.mocked(compare).mockResolvedValue(true);
    });

    it("should throw error when received key is not a string.", async() => {
      const expectedKey = "my-secret-api";
      const expectedError = new MissingApiKeyError();

      await expect(validateReceivedApiKey(expectedKey, undefined)).rejects.toThrowError(expectedError);
    });

    it("should hash received key when called.", async() => {
      const expectedKey = "my-secret-api";
      const receivedKey = "received-api-key";

      await validateReceivedApiKey(expectedKey, receivedKey);

      expect(vi.mocked(hash)).toHaveBeenCalledWith(receivedKey, expect.any(Number));
    });

    it("should hash expected key when called.", async() => {
      const expectedKey = "my-secret-api";
      const receivedKey = "received-api-key";

      await validateReceivedApiKey(expectedKey, receivedKey);

      expect(vi.mocked(hash)).toHaveBeenCalledWith(expectedKey, expect.any(Number));
    });

    it("should throw error when received key does not match expected key.", async() => {
      const expectedKey = "my-secret-api";
      const receivedKey = "invalid-api-key";
      const expectedError = new InvalidApiKeyError();
      // @ts-expect-error: Hash types are not correctly inferred
      vi.mocked(compare).mockResolvedValueOnce(false);

      await expect(validateReceivedApiKey(expectedKey, receivedKey)).rejects.toThrowError(expectedError);
    });

    it("should not throw error when received key matches expected key.", async() => {
      const expectedKey = "my-secret-api";
      const receivedKey = "my-secret-api";

      await expect(validateReceivedApiKey(expectedKey, receivedKey)).resolves.not.toThrowError();
    });
  });
});