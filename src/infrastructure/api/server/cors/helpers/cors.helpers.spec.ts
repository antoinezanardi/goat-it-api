import { createCorsConfig } from "@src/infrastructure/api/server/cors/helpers/cors.helpers";

import { createFakeCorsConfig } from "@factories/infrastructure/api/server/cors/cors.factory";

import type { CorsConfig } from "@src/infrastructure/api/server/cors/types/cors.types";

describe(createCorsConfig, () => {
  beforeEach(() => {
    delete process.env.CORS_ORIGIN;
    delete process.env.CORS_CREDENTIALS;
  });

  it("should return default CORS config when no environment variables are set.", () => {
    const corsConfig = createCorsConfig();
    const expectedCorsConfig = createFakeCorsConfig({
      origin: "*",
      credentials: false,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    expect(corsConfig).toStrictEqual<CorsConfig>(expectedCorsConfig);
  });

  it("should use CORS_ORIGIN environment variable when set.", () => {
    process.env.CORS_ORIGIN = "https://example.com";
    const corsConfig = createCorsConfig();

    expect(corsConfig.origin).toBe("https://example.com");
  });

  it("should handle comma-separated origins when CORS_ORIGIN contains multiple values.", () => {
    process.env.CORS_ORIGIN = "https://app.example.com,https://admin.example.com";
    const corsConfig = createCorsConfig();

    expect(corsConfig.origin).toBe("https://app.example.com,https://admin.example.com");
  });

  it("should set credentials to true when CORS_CREDENTIALS is 'true'.", () => {
    process.env.CORS_CREDENTIALS = "true";
    const corsConfig = createCorsConfig();

    expect(corsConfig.credentials).toBeTruthy();
  });

  it("should set credentials to false when CORS_CREDENTIALS is not 'true'.", () => {
    process.env.CORS_CREDENTIALS = "false";
    const corsConfig = createCorsConfig();

    expect(corsConfig.credentials).toBeFalsy();
  });
});