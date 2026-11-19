import { createCorsConfig } from "@src/infrastructure/api/server/cors/helpers/cors.helpers";

import { createFakeCorsConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";
import { createFakeCorsConfig } from "@faketories/infrastructure/api/server/cors/cors.faketory";

describe(createCorsConfig, () => {
  it("should return default CORS config when called.", () => {
    const corsConfigFromEnv = createFakeCorsConfigFromEnv({
      origin: "*",
    });
    const corsConfig = createCorsConfig(corsConfigFromEnv);
    const expectedCorsConfig = createFakeCorsConfig({
      origin: "*",
      credentials: false,
      methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      exposedHeaders: ["X-Request-Id"],
    });

    expect(corsConfig).toStrictEqual(expectedCorsConfig);
  });

  it("should use origin from configuration when provided.", () => {
    const corsConfigFromEnv = createFakeCorsConfigFromEnv({
      origin: "https://example.com",
    });
    const corsConfig = createCorsConfig(corsConfigFromEnv);

    expect(corsConfig.origin).toBe("https://example.com");
  });

  it("should set credentials to false when called.", () => {
    const corsConfigFromEnv = createFakeCorsConfigFromEnv();
    const corsConfig = createCorsConfig(corsConfigFromEnv);

    expect(corsConfig.credentials).toBeFalsy();
  });

  it("should set allowed methods to default values when called.", () => {
    const corsConfigFromEnv = createFakeCorsConfigFromEnv();
    const corsConfig = createCorsConfig(corsConfigFromEnv);

    expect(corsConfig.methods).toStrictEqual(["GET", "POST", "DELETE", "PATCH", "OPTIONS"]);
  });

  it("should expose only the request id response header when called.", () => {
    const corsConfigFromEnv = createFakeCorsConfigFromEnv();
    const corsConfig = createCorsConfig(corsConfigFromEnv);

    expect(corsConfig.exposedHeaders).toStrictEqual(["X-Request-Id"]);
  });

  it("should keep the api key header out of the allowed headers when called.", () => {
    const corsConfigFromEnv = createFakeCorsConfigFromEnv();
    const corsConfig = createCorsConfig(corsConfigFromEnv);

    expect(corsConfig.allowedHeaders).toStrictEqual(["Content-Type", "Authorization"]);
  });
});