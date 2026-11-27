import { applyResponseCachePolicyOnSend, isPreservedPublicAssetResponse, setupResponseCachePolicy } from "@src/infrastructure/api/server/cache/helpers/cache.helpers";

import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

describe(isPreservedPublicAssetResponse, () => {
  type PreservedPublicAssetCase = {
    test: string;
    url: string;
    statusCode: number;
    cacheControlValue?: string;
    etagValue?: string;
    lastModifiedValue?: string;
    expected: boolean;
  };

  let mocks: {
    reply: FastifyReply;
    request: FastifyRequest;
  };

  beforeEach(() => {
    mocks = {
      reply: {
        statusCode: 200,
        getHeader: vi.fn<(name: string) => string | undefined>().mockReturnValue(undefined),
      } as unknown as FastifyReply,
      request: {
        url: "/public/img/logo/logo-16.avif",
      } as FastifyRequest,
    };
  });

  it.each<PreservedPublicAssetCase>([
    {
      test: "should preserve a file response carrying an etag when the path is a public asset.",
      url: "/public/img/logo/logo-16.avif",
      statusCode: 200,
      cacheControlValue: "public, max-age=0",
      etagValue: "W/\"a1b2c3-17a1b2c3d4e\"",
      expected: true,
    },
    {
      test: "should preserve a partial file response carrying a last modified validator when the path is a public asset.",
      url: "/public/img/logo/logo-16.avif",
      statusCode: 206,
      cacheControlValue: "public, max-age=0",
      lastModifiedValue: "Wed, 01 Jan 2025 00:00:00 GMT",
      expected: true,
    },
    {
      test: "should preserve a not modified file response when the path is a public asset.",
      url: "/public/img/logo/logo-16.avif",
      statusCode: 304,
      cacheControlValue: "public, max-age=0",
      etagValue: "W/\"a1b2c3-17a1b2c3d4e\"",
      expected: true,
    },
    {
      test: "should not preserve a documentation asset served by the static plugin.",
      url: "/docs/swagger-ui.css",
      statusCode: 200,
      cacheControlValue: "public, max-age=0",
      etagValue: "W/\"a1b2c3-17a1b2c3d4e\"",
      expected: false,
    },
    {
      test: "should not preserve the public path without a trailing file segment.",
      url: "/public",
      statusCode: 200,
      cacheControlValue: "public, max-age=0",
      etagValue: "W/\"a1b2c3-17a1b2c3d4e\"",
      expected: false,
    },
    {
      test: "should not preserve a missing public asset answered with a not found status.",
      url: "/public/unknown",
      statusCode: 404,
      cacheControlValue: "public, max-age=0",
      etagValue: "W/\"a1b2c3-17a1b2c3d4e\"",
      expected: false,
    },
    {
      test: "should not preserve a public asset without any file validator.",
      url: "/public/img/logo/logo-16.avif",
      statusCode: 200,
      cacheControlValue: "public, max-age=0",
      expected: false,
    },
    {
      test: "should not preserve a public asset whose cache control header is no-store.",
      url: "/public/img/logo/logo-16.avif",
      statusCode: 200,
      cacheControlValue: "no-store",
      etagValue: "W/\"a1b2c3-17a1b2c3d4e\"",
      expected: false,
    },
    {
      test: "should not preserve a public asset answered with a server error status.",
      url: "/public/img/logo/logo-16.avif",
      statusCode: 500,
      cacheControlValue: "public, max-age=0",
      etagValue: "W/\"a1b2c3-17a1b2c3d4e\"",
      expected: false,
    },
  ])("$test", ({ url, statusCode, cacheControlValue, etagValue, lastModifiedValue, expected }) => {
    mocks.request = { url } as FastifyRequest;
    mocks.reply.statusCode = statusCode;
    vi.mocked(mocks.reply.getHeader).mockImplementation((headerName: string): string | undefined => {
      const headerValues: Record<string, string | undefined> = {
        "Cache-Control": cacheControlValue,
        "ETag": etagValue,
        "Last-Modified": lastModifiedValue,
      };

      return headerValues[headerName];
    });

    expect(isPreservedPublicAssetResponse(mocks.request, mocks.reply)).toBe(expected);
  });
});

describe(applyResponseCachePolicyOnSend, () => {
  let mocks: {
    reply: FastifyReply;
    request: FastifyRequest;
    done: (error?: Error | null, payload?: unknown) => void;
  };

  beforeEach(() => {
    mocks = {
      reply: {
        statusCode: 200,
        getHeader: vi.fn<(name: string) => string | undefined>().mockReturnValue(undefined),
        header: vi.fn<(name: string, value: string) => void>(),
      } as unknown as FastifyReply,
      request: {
        url: "/questions",
      } as FastifyRequest,
      done: vi.fn<(error?: Error | null, payload?: unknown) => void>(),
    };
  });

  it("should set the no-store cache control header when the response is not a preserved public asset.", () => {
    applyResponseCachePolicyOnSend(mocks.request, mocks.reply, "payload", mocks.done);

    expect(mocks.reply.header).toHaveBeenCalledWith("Cache-Control", "no-store");
  });

  it("should set the accept language vary header when the response is not a preserved public asset.", () => {
    applyResponseCachePolicyOnSend(mocks.request, mocks.reply, "payload", mocks.done);

    expect(mocks.reply.header).toHaveBeenCalledWith("Vary", "Accept-Language");
  });

  it("should merge an existing vary header when the response is not a preserved public asset.", () => {
    const headerValues: Record<string, string | undefined> = {
      Vary: "Origin",
    };
    vi.mocked(mocks.reply.getHeader).mockImplementation((headerName: string): string | undefined => headerValues[headerName]);

    applyResponseCachePolicyOnSend(mocks.request, mocks.reply, "payload", mocks.done);

    expect(mocks.reply.header).toHaveBeenCalledWith("Vary", "Origin, Accept-Language");
  });

  it("should not rewrite the cache headers when the response is a preserved public asset.", () => {
    mocks.request = { url: "/public/img/logo/logo-16.avif" } as FastifyRequest;
    vi.mocked(mocks.reply.getHeader).mockImplementation((headerName: string): string | undefined => {
      const headerValues: Record<string, string | undefined> = {
        "Cache-Control": "public, max-age=0",
        "ETag": "W/\"a1b2c3-17a1b2c3d4e\"",
      };

      return headerValues[headerName];
    });

    applyResponseCachePolicyOnSend(mocks.request, mocks.reply, "payload", mocks.done);

    expect(mocks.reply.header).not.toHaveBeenCalled();
  });

  it("should pass the payload through when the response is not a preserved public asset.", () => {
    const payload = "{\"status\":\"ok\"}";

    applyResponseCachePolicyOnSend(mocks.request, mocks.reply, payload, mocks.done);

    expect(mocks.done).toHaveBeenCalledExactlyOnceWith(undefined, payload);
  });

  it("should pass the stream payload through when the response is a preserved public asset.", () => {
    mocks.request = { url: "/public/img/logo/logo-16.avif" } as FastifyRequest;
    vi.mocked(mocks.reply.getHeader).mockImplementation((headerName: string): string | undefined => {
      const headerValues: Record<string, string | undefined> = {
        "Cache-Control": "public, max-age=0",
        "ETag": "W/\"a1b2c3-17a1b2c3d4e\"",
      };

      return headerValues[headerName];
    });
    const payload = { isStream: true };

    applyResponseCachePolicyOnSend(mocks.request, mocks.reply, payload, mocks.done);

    expect(mocks.done).toHaveBeenCalledExactlyOnceWith(undefined, payload);
  });
});

describe(setupResponseCachePolicy, () => {
  let mocks: {
    app: NestFastifyApplication;
  };

  beforeEach(() => {
    const mockedInstance = {
      addHook: vi.fn<(name: string, hook: unknown) => void>(),
    };
    mocks = {
      app: {
        getHttpAdapter: (): { getInstance: () => FastifyInstance } => ({
          getInstance: (): FastifyInstance => mockedInstance as unknown as FastifyInstance,
        }),
      } as unknown as NestFastifyApplication,
    };
  });

  it("should register the cache policy on send hook when called.", () => {
    setupResponseCachePolicy(mocks.app);

    expect(mocks.app.getHttpAdapter().getInstance().addHook).toHaveBeenCalledExactlyOnceWith("onSend", applyResponseCachePolicyOnSend);
  });
});