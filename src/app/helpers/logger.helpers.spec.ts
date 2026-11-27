import { getLoggerConfiguration } from "@app/helpers/logger.helpers";

import type { LoggedRequest, LoggedResponse } from "@app/helpers/logger.helpers.types";

type LoggerOptionsForTest = {
  serializers: {
    req: (request: LoggedRequest) => LoggedRequest;
    res: (response: LoggedResponse) => LoggedResponse;
  };
  redact: {
    paths: string[];
    censor: string;
  };
  transport: unknown;
};

const EXPECTED_REDACTION_PATHS = [
  "headers",
  "*.headers",
  "*.*.headers",
  "[\"goat-it-api-key\"]",
  "*.headers[\"goat-it-api-key\"]",
  "req.remoteAddress",
  "req.remotePort",
  "*.remoteAddress",
  "*.remotePort",
  "authorization",
  "cookie",
  "apiKey",
  "gameKey",
  "token",
  "password",
  "secret",
  "apiKeyHash",
  "hmacSecret",
  "*.authorization",
  "*.cookie",
  "*.apiKey",
  "*.gameKey",
  "*.token",
  "*.password",
  "*.secret",
  "*.apiKeyHash",
  "*.hmacSecret",
  "*.*.authorization",
  "*.*.cookie",
  "*.*.apiKey",
  "*.*.gameKey",
  "*.*.token",
  "*.*.password",
  "*.*.secret",
  "*.*.apiKeyHash",
  "*.*.hmacSecret",
];

function getLoggerOptionsForTest(): LoggerOptionsForTest {
  return getLoggerConfiguration().pinoHttp as unknown as LoggerOptionsForTest;
}

describe(getLoggerConfiguration, () => {
  const originalNodeEnv: { value?: string } = {};

  beforeEach(() => {
    originalNodeEnv.value = process.env.NODE_ENV;
  });

  afterEach(() => {
    if (originalNodeEnv.value === undefined) {
      Reflect.deleteProperty(process.env, "NODE_ENV");
    } else {
      process.env.NODE_ENV = originalNodeEnv.value;
    }
  });

  it.each<{ test: string; nodeEnv: string; expectedTransport: unknown }>([
    {
      test: "should return the production transport when env is production.",
      nodeEnv: "production",
      expectedTransport: undefined,
    },
    {
      test: "should return the development transport when env is not production.",
      nodeEnv: "development",
      expectedTransport: { target: "pino-pretty" },
    },
  ])("$test", ({ nodeEnv, expectedTransport }) => {
    process.env.NODE_ENV = nodeEnv;

    expect(getLoggerOptionsForTest().transport).toStrictEqual(expectedTransport);
  });

  it("should redact every credential-bearing path when called.", () => {
    expect(getLoggerOptionsForTest().redact).toStrictEqual({
      paths: EXPECTED_REDACTION_PATHS,
      censor: "[REDACTED]",
    });
  });

  describe("request serializer", () => {
    type LoggedRequestWithExtraFields = LoggedRequest & {
      headers?: Record<string, string>;
      remoteAddress?: string;
      remotePort?: number;
      query?: Record<string, string>;
      body?: unknown;
    };

    it.each<{ test: string; request: LoggedRequestWithExtraFields; expectedRequest: LoggedRequest }>([
      {
        test: "should keep only the request id, method and path without the query string when called.",
        request: {
          id: "request-id",
          method: "GET",
          url: "/questions?limit=10",
          headers: { "authorization": "secret", "goat-it-api-key": "secret" },
          remoteAddress: "127.0.0.1",
          remotePort: 4242,
          query: { limit: "10" },
          body: { secret: true },
        },
        expectedRequest: { id: "request-id", method: "GET", url: "/questions" },
      },
      {
        test: "should keep an undefined url when the request carries none.",
        request: { id: "request-id", method: "GET", url: undefined },
        expectedRequest: { id: "request-id", method: "GET", url: undefined },
      },
    ])("$test", ({ request, expectedRequest }) => {
      expect(getLoggerOptionsForTest().serializers.req(request)).toStrictEqual(expectedRequest);
    });
  });

  describe("response serializer", () => {
    it("should keep only the status code when called.", () => {
      type LoggedResponseWithExtraFields = LoggedResponse & {
        headers?: Record<string, string>;
      };

      const response: LoggedResponseWithExtraFields = {
        statusCode: 204,
        headers: { "x-secret": "value" },
      };

      expect(getLoggerOptionsForTest().serializers.res(response)).toStrictEqual({ statusCode: 204 });
    });
  });
});