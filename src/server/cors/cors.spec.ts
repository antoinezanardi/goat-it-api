import { buildCorsConfig } from "@server/cors";

describe("buildCorsConfig()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.CORS_ORIGIN;
    delete process.env.CORS_CREDENTIALS;
  });

  it("should return default CORS config when no environment variables are set.", () => {
    const corsConfig = buildCorsConfig();

    expect(corsConfig).toStrictEqual({
      origin: "*",
      credentials: false,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });
  });

  it("should use CORS_ORIGIN environment variable when set.", () => {
    process.env.CORS_ORIGIN = "https://example.com";
    
    const corsConfig = buildCorsConfig();

    expect(corsConfig.origin).toBe("https://example.com");
  });

  it("should set credentials to true when CORS_CREDENTIALS is 'true'.", () => {
    process.env.CORS_CREDENTIALS = "true";
    
    const corsConfig = buildCorsConfig();

    expect(corsConfig.credentials).toBeTruthy();
  });

  it("should set credentials to false when CORS_CREDENTIALS is not 'true'.", () => {
    process.env.CORS_CREDENTIALS = "false";
    
    const corsConfig = buildCorsConfig();

    expect(corsConfig.credentials).toBeFalsy();
  });
});