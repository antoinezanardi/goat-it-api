import { applyOptionsSecurityHeadersOnSend, setPermissionsPolicyHeaderOnRequest, setupSecurityHeaders, setupSecurityHeadersRequestHook } from "@src/infrastructure/api/server/security-headers/helpers/security-headers.helpers";

import type { SecurityHeadersOptions } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

describe(setupSecurityHeaders, () => {
  let mocks: {
    app: NestFastifyApplication;
  };

  beforeEach(() => {
    const mockedInstance = {
      addHook: vi.fn<(name: string, hook: unknown) => void>(),
    };
    mocks = {
      app: {
        useSecurityHeaders: vi.fn<(options?: SecurityHeadersOptions) => void>(),
        getHttpAdapter: (): { getInstance: () => FastifyInstance } => ({
          getInstance: (): FastifyInstance => mockedInstance as unknown as FastifyInstance,
        }),
      } as unknown as NestFastifyApplication,
    };
  });

  it("should enable the nest security headers with the documented options when called.", () => {
    setupSecurityHeaders(mocks.app);
    const expectedOptions: SecurityHeadersOptions = {
      contentSecurityPolicy: {
        directives: {
          upgradeInsecureRequests: false,
        },
      },
      strictTransportSecurity: {
        maxAge: 31_536_000,
        includeSubDomains: false,
        preload: false,
      },
      xContentTypeOptions: true,
      xFrameOptions: {
        action: "deny",
      },
      referrerPolicy: {
        policy: "no-referrer",
      },
      crossOriginResourcePolicy: {
        policy: "same-site",
      },
    };

    expect(mocks.app.useSecurityHeaders).toHaveBeenCalledExactlyOnceWith(expectedOptions);
  });

  it("should keep the native cross origin opener policy default when called.", () => {
    setupSecurityHeaders(mocks.app);
    const options = vi.mocked(mocks.app.useSecurityHeaders).mock.calls[0][0];

    expect(options).not.toHaveProperty("crossOriginOpenerPolicy");
  });

  it("should keep the cross origin embedder policy absent when called.", () => {
    setupSecurityHeaders(mocks.app);
    const options = vi.mocked(mocks.app.useSecurityHeaders).mock.calls[0][0];

    expect(options).not.toHaveProperty("crossOriginEmbedderPolicy");
  });

  it("should register the options security headers fallback hook when called.", () => {
    setupSecurityHeaders(mocks.app);

    expect(mocks.app.getHttpAdapter().getInstance().addHook).toHaveBeenCalledExactlyOnceWith("onSend", applyOptionsSecurityHeadersOnSend);
  });
});

describe(setupSecurityHeadersRequestHook, () => {
  it("should register the permissions policy request hook when called.", () => {
    const fastifyInstance = {
      addHook: vi.fn<(name: string, hook: unknown) => void>(),
    } as unknown as FastifyInstance;

    setupSecurityHeadersRequestHook(fastifyInstance);

    expect(fastifyInstance.addHook).toHaveBeenCalledExactlyOnceWith("onRequest", setPermissionsPolicyHeaderOnRequest);
  });
});

describe(setPermissionsPolicyHeaderOnRequest, () => {
  let mocks: {
    reply: FastifyReply;
    done: () => void;
  };

  beforeEach(() => {
    mocks = {
      reply: {
        raw: {
          setHeader: vi.fn<(name: string, value: string) => void>(),
        },
      } as unknown as FastifyReply,
      done: vi.fn<() => void>(),
    };
  });

  it("should write the permissions policy header on the raw response when called.", () => {
    setPermissionsPolicyHeaderOnRequest({} as FastifyRequest, mocks.reply, mocks.done);

    expect(mocks.reply.raw.setHeader).toHaveBeenCalledExactlyOnceWith("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  });

  it("should continue the request when called.", () => {
    setPermissionsPolicyHeaderOnRequest({} as FastifyRequest, mocks.reply, mocks.done);

    expect(mocks.done).toHaveBeenCalledExactlyOnceWith();
  });
});

describe(applyOptionsSecurityHeadersOnSend, () => {
  const expectedOptionsSecurityHeaders: readonly (readonly [string, string])[] = [
    [
      "Content-Security-Policy",
      "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';" +
      "img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';" +
      "style-src 'self' https: 'unsafe-inline'",
    ],
    ["Cross-Origin-Opener-Policy", "same-origin"],
    ["Cross-Origin-Resource-Policy", "same-site"],
    ["Origin-Agent-Cluster", "?1"],
    ["Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()"],
    ["Referrer-Policy", "no-referrer"],
    ["Strict-Transport-Security", "max-age=31536000"],
    ["X-Content-Type-Options", "nosniff"],
    ["X-DNS-Prefetch-Control", "off"],
    ["X-Download-Options", "noopen"],
    ["X-Frame-Options", "DENY"],
    ["X-Permitted-Cross-Domain-Policies", "none"],
    ["X-XSS-Protection", "0"],
  ];

  let mocks: {
    reply: FastifyReply;
    request: FastifyRequest;
    done: (error?: Error | null, payload?: unknown) => void;
  };

  beforeEach(() => {
    mocks = {
      reply: {
        getHeader: vi.fn<(name: string) => string | undefined>().mockReturnValue(undefined),
        header: vi.fn<(name: string, value: string) => void>(),
        removeHeader: vi.fn<(name: string) => void>(),
      } as unknown as FastifyReply,
      request: {
        method: "OPTIONS",
      } as FastifyRequest,
      done: vi.fn<(error?: Error | null, payload?: unknown) => void>(),
    };
  });

  it.each<{
    test: string;
    headerName: string;
    headerValue: string;
  }>(expectedOptionsSecurityHeaders.map(([headerName, headerValue]) => ({
    test: `should set the "${headerName}" security header on a preflight reply when called.`,
    headerName,
    headerValue,
  })))("$test", ({ headerName, headerValue }) => {
    applyOptionsSecurityHeadersOnSend(mocks.request, mocks.reply, "payload", mocks.done);

    expect(mocks.reply.header).toHaveBeenCalledWith(headerName, headerValue);
  });

  it("should not overwrite a security header the reply already carries when called.", () => {
    const replyHeaders: Record<string, string | undefined> = {
      "X-Frame-Options": "SAMEORIGIN",
    };
    vi.mocked(mocks.reply.getHeader).mockImplementation((name: string): string | undefined => replyHeaders[name]);

    applyOptionsSecurityHeadersOnSend(mocks.request, mocks.reply, "payload", mocks.done);

    expect(mocks.reply.header).not.toHaveBeenCalledWith("X-Frame-Options", "DENY");
  });

  it("should not set any security header on a non preflight reply when called.", () => {
    mocks.request = { method: "GET" } as FastifyRequest;

    applyOptionsSecurityHeadersOnSend(mocks.request, mocks.reply, "payload", mocks.done);

    expect(mocks.reply.header).not.toHaveBeenCalled();
  });

  it("should remove the powered by header when the reply carries it.", () => {
    const replyHeaders: Record<string, string | undefined> = {
      "X-Powered-By": "Nest",
    };
    vi.mocked(mocks.reply.getHeader).mockImplementation((name: string): string | undefined => replyHeaders[name]);

    applyOptionsSecurityHeadersOnSend(mocks.request, mocks.reply, "payload", mocks.done);

    expect(mocks.reply.removeHeader).toHaveBeenCalledExactlyOnceWith("X-Powered-By");
  });

  it("should not remove the powered by header when the reply does not carry it.", () => {
    applyOptionsSecurityHeadersOnSend(mocks.request, mocks.reply, "payload", mocks.done);

    expect(mocks.reply.removeHeader).not.toHaveBeenCalled();
  });

  it("should not touch the access control headers when called.", () => {
    applyOptionsSecurityHeadersOnSend(mocks.request, mocks.reply, "payload", mocks.done);
    const writtenHeaderNames = vi.mocked(mocks.reply.header).mock.calls.map(([headerName]) => headerName);

    expect(writtenHeaderNames.filter(headerName => headerName.startsWith("Access-Control-"))).toStrictEqual([]);
  });

  it("should pass the payload through when called.", () => {
    const payload = { statusCode: 204 };

    applyOptionsSecurityHeadersOnSend(mocks.request, mocks.reply, payload, mocks.done);

    expect(mocks.done).toHaveBeenCalledExactlyOnceWith(undefined, payload);
  });
});