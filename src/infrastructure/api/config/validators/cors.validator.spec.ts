import { validateCorsOrigin } from "@src/infrastructure/api/config/validators/cors.validator";

describe("Cors Validators", () => {
  describe(validateCorsOrigin, () => {
    it.each<{
      test: string;
      value: string;
      isValid: boolean;
    }>([
      {
        test: "should return true for wildcard '*'.",
        value: "*",
        isValid: true,
      },
      {
        test: "should return true for valid domain 'http://example.com'.",
        value: "http://example.com",
        isValid: true,
      },
      {
        test: "should return true for valid domain with path 'https://example.com/path'.",
        value: "https://example.com/path",
        isValid: true,
      },
      {
        test: "should return true for valid domain with port 'http://example.com:8080'.",
        value: "http://example.com:8080",
        isValid: true,
      },
      {
        test: "should return false for invalid URL 'invalid_url'.",
        value: "invalid_url",
        isValid: false,
      },
      {
        test: "should return false for URL with unsupported protocol 'ftp://example.com'.",
        value: "ftp://example.com",
        isValid: false,
      },
      {
        test: "should return false for URL with unsupported protocol 'httpp://example.com'.",
        value: "httpp://example.com",
        isValid: false,
      },
      {
        test: "should return false for URL with unsupported protocol 'hhttp://example.com'.",
        value: "hhttp://example.com",
        isValid: false,
      },
      {
        test: "should return false for IP-based URL 'http://127.0.0.1:3000'.",
        value: "http://127.0.0.1:3000",
        isValid: false,
      },
      {
        test: "should return false for localhost URL 'http://localhost:8080'.",
        value: "http://localhost:8080",
        isValid: false,
      },
      {
        test: "should return false for empty string ''.",
        value: "",
        isValid: false,
      },
    ])("$test", ({ value, isValid }) => {
      expect(validateCorsOrigin(value)).toBe(isValid);
    });
  });
});