import { createCorsConfig } from "@src/infrastructure/api/server/cors/helpers/cors.helpers";

import { createFakeCorsConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";
import { createFakeCorsConfig } from "@faketories/infrastructure/api/server/cors/cors.faketory";

import type { CorsConfig } from "@src/infrastructure/api/server/cors/types/cors.types";

describe(createCorsConfig, () => {
  beforeEach(() => {
    delete process.env.CORS_ORIGIN;
    delete process.env.CORS_CREDENTIALS;
  });

  it("should return default CORS config when called.", () => {
    const corsConfigFromEnv = createFakeCorsConfigFromEnv({
      origin: "*",
    });
    const corsConfig = createCorsConfig(corsConfigFromEnv);
    const expectedCorsConfig = createFakeCorsConfig({
      origin: "*",
      credentials: false,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    expect(corsConfig).toStrictEqual<CorsConfig>(expectedCorsConfig);
  });

  it("should use CORS_ORIGIN environment variable when set.", () => {
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

  it("should set allowed methods and headers to default values when called.", () => {
    const corsConfigFromEnv = createFakeCorsConfigFromEnv();
    const corsConfig = createCorsConfig(corsConfigFromEnv);

    expect(corsConfig.methods).toStrictEqual<string[]>(["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]);
  });
});