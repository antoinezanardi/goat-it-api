import { consoleIntegration, fastifyIntegration, onUncaughtExceptionIntegration, onUnhandledRejectionIntegration } from "@sentry/nestjs";

import packageJson from "@package-json" with { type: "json" };

import * as configModuleHelpers from "@src/infrastructure/api/config/helpers/config-module.helpers";
import * as sentrySdkHelpers from "@src/infrastructure/api/observability/sentry/helpers/sentry-sdk.helpers";
import { captureServerError, createRedactedSentryError, createRedactedSentryEvent, createSentryInitOptions, createSentryIntegrations, createUncaughtExceptionIntegrationOptions, dropSentryBreadcrumb, handleSentryFatalError, initializeSentry } from "@src/infrastructure/api/observability/sentry/helpers/sentry.helpers";

import { createFakeAppEnv } from "@faketories/infrastructure/api/config/env.faketory";

import type { NodeOptions } from "@sentry/nestjs";

import type { SentryErrorEvent } from "@src/infrastructure/api/observability/sentry/helpers/sentry.helpers.types";

function createFakeSentryErrorEvent(event: Partial<SentryErrorEvent> = {}): SentryErrorEvent {
  return {
    type: undefined,
    event_id: "8f1c1a44f0a04dd6a4a0d6f2d6b0a1c9",
    timestamp: 1_763_000_000,
    level: "error",
    platform: "node",
    sdk: {
      name: "sentry.javascript.nestjs",
      version: "11.15.0",
      packages: [{ name: "npm:@sentry/nestjs", version: "11.15.0" }],
    },
    environment: "production",
    release: "goat-it-api@1.25.0",
    server_name: "goat-it-api-1",
    transaction: "/admin/questions",
    request: {
      url: "https://api.goat-it.fr/admin/questions?apiKey=secret",
      method: "POST",
      headers: { "goat-it-api-key": "secret" },
      data: { statement: "secret" },
    },
    user: { id: "user-id", ip_address: "127.0.0.1" },
    contexts: { runtime: { name: "node", version: "26.13.1" } },
    extra: { payload: "secret" },
    breadcrumbs: [{ message: "secret" }],
    modules: { mongoose: "9.12.2" },
    tags: {
      "errorClass": "QuestionCreationError",
      "http.route": "/admin/questions",
      "http.request.method": "POST",
      "http.response.status_code": "500",
      "http.request.id": "request-id",
      "feature": "questions",
    },
    exception: {
      values: [
        {
          type: "QuestionCreationError",
          value: "explosive secret message",
          mechanism: { type: "generic", handled: false, data: { secret: "value" } },
          stacktrace: {
            frames: [
              {
                filename: "/app/dist/contexts/question/question.js",
                function: "createQuestion",
                lineno: 12,
                colno: 34,
                in_app: true,
                context_line: "const secret = 'value';",
                pre_context: ["secret"],
                post_context: ["secret"],
                vars: { secret: "value" },
              },
            ],
          },
        },
      ],
    },
    ...event,
  };
}

describe(createRedactedSentryError, () => {
  it("should name the redacted error after the given error class when called.", () => {
    const redactedError = createRedactedSentryError(new Error("Explosive secret value"), "QuestionCreationError");

    expect(redactedError.name).toBe("QuestionCreationError");
  });

  it("should use the redacted placeholder as message when called.", () => {
    const redactedError = createRedactedSentryError(new Error("Explosive secret value"), "QuestionCreationError");

    expect(redactedError.message).toBe("[REDACTED]");
  });

  it("should not carry any part of the original message when called with an Error.", () => {
    const redactedError = createRedactedSentryError(new Error("Explosive secret value"), "QuestionCreationError");

    expect([redactedError.name, redactedError.message, redactedError.stack].join(" ")).not.toContain("Explosive secret value");
  });

  it("should drop the first line of the original stack when called with an Error.", () => {
    const originalError = new Error("Explosive secret value");
    const expectedStack = String(originalError.stack).split("\n").slice(1).join("\n");

    expect(createRedactedSentryError(originalError, "QuestionCreationError").stack).toBe(expectedStack);
  });

  it("should build a synthetic stack when called with a value that is not an Error.", () => {
    const redactedError = createRedactedSentryError("Some unknown exception", "NonErrorThrown");

    expect(redactedError.stack).toContain("createRedactedSentryError");
  });
});

describe(createRedactedSentryEvent, () => {
  it("should return null when the event carries no exception when called.", () => {
    expect(createRedactedSentryEvent(createFakeSentryErrorEvent({ exception: undefined }))).toBeNull();
  });

  it("should return null when the event carries no exception value when called.", () => {
    expect(createRedactedSentryEvent(createFakeSentryErrorEvent({ exception: { values: [] } }))).toBeNull();
  });

  it("should return the allow-listed event when called with a full event.", () => {
    const expectedEvent: SentryErrorEvent = {
      type: undefined,
      event_id: "8f1c1a44f0a04dd6a4a0d6f2d6b0a1c9",
      timestamp: 1_763_000_000,
      level: "error",
      platform: "node",
      sdk: {
        name: "sentry.javascript.nestjs",
        version: "11.15.0",
      },
      environment: "production",
      release: "goat-it-api@1.25.0",
      tags: {
        "errorClass": "QuestionCreationError",
        "http.route": "/admin/questions",
        "http.request.method": "POST",
        "http.response.status_code": "500",
      },
      exception: {
        values: [
          {
            type: "QuestionCreationError",
            value: "[REDACTED]",
            stacktrace: {
              frames: [
                {
                  filename: "/app/dist/contexts/question/question.js",
                  function: "createQuestion",
                  lineno: 12,
                  colno: 34,
                  in_app: true,
                },
              ],
            },
          },
        ],
      },
    };

    expect(createRedactedSentryEvent(createFakeSentryErrorEvent())).toStrictEqual(expectedEvent);
  });

  it("should omit an allowed tag the event does not carry when called.", () => {
    const redactedEvent = createRedactedSentryEvent(createFakeSentryErrorEvent({ tags: { errorClass: "QuestionCreationError" } }));

    expect(redactedEvent?.tags).toStrictEqual({ errorClass: "QuestionCreationError" });
  });

  it("should return an empty frame list when the exception value carries no stacktrace when called.", () => {
    const redactedEvent = createRedactedSentryEvent(createFakeSentryErrorEvent({ exception: { values: [{ type: "Error", value: "secret" }] } }));

    expect(redactedEvent?.exception).toStrictEqual({
      values: [{ type: "Error", value: "[REDACTED]", stacktrace: { frames: [] } }],
    });
  });

  it("should not carry any original event text when called.", () => {
    expect(JSON.stringify(createRedactedSentryEvent(createFakeSentryErrorEvent()))).not.toContain("secret");
  });

  it("should not mutate the received event when called.", () => {
    const event = createFakeSentryErrorEvent();
    const originalEvent = structuredClone(event);

    createRedactedSentryEvent(event);

    expect(event).toStrictEqual(originalEvent);
  });
});

describe(dropSentryBreadcrumb, () => {
  it("should return null when called.", () => {
    expect(dropSentryBreadcrumb()).toBeNull();
  });
});

describe(createSentryInitOptions, () => {
  it("should return the allow-listed SDK options when called.", () => {
    const appEnv = createFakeAppEnv({
      SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
      SENTRY_ENVIRONMENT: "production",
    });
    const expectedOptions: NodeOptions = {
      dsn: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
      environment: "production",
      release: packageJson.version,
      includeServerName: false,
      maxBreadcrumbs: 0,
      dataCollection: {
        userInfo: false,
        cookies: false,
        httpHeaders: false,
        httpBodies: [],
        urlQueryParams: false,
        graphQL: { document: false, variables: false },
        genAI: { inputs: false, outputs: false },
        mcp: { inputs: false, outputs: false },
        databaseQueryData: false,
        queues: false,
        stackFrameVariables: false,
        frameContextLines: 0,
      },
      integrations: createSentryIntegrations,
      beforeSend: createRedactedSentryEvent,
      beforeBreadcrumb: dropSentryBreadcrumb,
    };

    expect(createSentryInitOptions(appEnv)).toStrictEqual(expectedOptions);
  });
});

describe(createSentryIntegrations, () => {
  it("should drop the Fastify integration when called with it.", () => {
    const integrationNames = createSentryIntegrations([fastifyIntegration(), consoleIntegration()]).map(integration => integration.name);

    expect(integrationNames).toStrictEqual([consoleIntegration().name, onUncaughtExceptionIntegration().name]);
  });

  it("should drop the unhandled-rejection integration when called with it.", () => {
    const integrationNames = createSentryIntegrations([onUnhandledRejectionIntegration(), consoleIntegration()]).map(integration => integration.name);

    expect(integrationNames).toStrictEqual([consoleIntegration().name, onUncaughtExceptionIntegration().name]);
  });

  it("should drop the default uncaught-exception integration when called with it.", () => {
    const integrationNames = createSentryIntegrations([onUncaughtExceptionIntegration(), consoleIntegration()]).map(integration => integration.name);

    expect(integrationNames).toStrictEqual([consoleIntegration().name, onUncaughtExceptionIntegration().name]);
  });
});

describe(createUncaughtExceptionIntegrationOptions, () => {
  beforeEach(() => {
    vi.spyOn(sentrySdkHelpers, "closeSentryClient").mockResolvedValue(true);
    vi.spyOn(process, "exit").mockImplementation(vi.fn<() => never>());
  });

  it("should not exit when other handlers are registered when called.", () => {
    expect(createUncaughtExceptionIntegrationOptions().exitEvenIfOtherHandlersAreRegistered).toBe(false);
  });

  it("should close the tracker client when the fatal hook is called.", () => {
    createUncaughtExceptionIntegrationOptions().onFatalError?.(new Error("Fatal error"));

    expect(sentrySdkHelpers.closeSentryClient).toHaveBeenCalledExactlyOnceWith(2000);
  });
});

describe(handleSentryFatalError, () => {
  beforeEach(() => {
    vi.spyOn(sentrySdkHelpers, "closeSentryClient").mockResolvedValue(true);
    vi.spyOn(process, "exit").mockImplementation(vi.fn<() => never>());
  });

  it("should close the tracker client with the bounded timeout when called.", async() => {
    await handleSentryFatalError();

    expect(sentrySdkHelpers.closeSentryClient).toHaveBeenCalledExactlyOnceWith(2000);
  });

  it("should exit with a failure code when called.", async() => {
    await handleSentryFatalError();

    expect(process.exit).toHaveBeenCalledExactlyOnceWith(1);
  });
});

describe(captureServerError, () => {
  beforeEach(() => {
    vi.spyOn(sentrySdkHelpers, "captureSentryException").mockReturnValue("event-id");
  });

  it("should report exactly once with the four controlled tags when called.", () => {
    captureServerError(new Error("Explosive secret value"), {
      errorClass: "QuestionCreationError",
      route: "/admin/questions",
      method: "POST",
    });

    expect(sentrySdkHelpers.captureSentryException).toHaveBeenCalledExactlyOnceWith(expect.any(Error), {
      "errorClass": "QuestionCreationError",
      "http.route": "/admin/questions",
      "http.request.method": "POST",
      "http.response.status_code": "500",
    });
  });

  it("should report a redacted error instead of the original one when called.", () => {
    captureServerError(new Error("Explosive secret value"), {
      errorClass: "QuestionCreationError",
      route: "/admin/questions",
      method: "POST",
    });
    const [reportedError] = vi.mocked(sentrySdkHelpers.captureSentryException).mock.calls[0];

    expect(reportedError).toStrictEqual(expect.objectContaining({
      name: "QuestionCreationError",
      message: "[REDACTED]",
    }));
  });

  it("should let a tracker failure propagate to the caller when called.", () => {
    vi.mocked(sentrySdkHelpers.captureSentryException).mockImplementation(() => {
      throw new Error("Tracker is unavailable");
    });

    expect(() => captureServerError(new Error("Explosive secret value"), {
      errorClass: "QuestionCreationError",
      route: "unknown",
      method: "unknown",
    })).toThrow("Tracker is unavailable");
  });
});

describe(initializeSentry, () => {
  beforeEach(() => {
    vi.spyOn(sentrySdkHelpers, "initSentrySdk").mockReturnValue(undefined);
  });

  it("should not initialize the tracker when no DSN is configured.", () => {
    vi.spyOn(configModuleHelpers, "getAppEnv").mockReturnValue(createFakeAppEnv({ SENTRY_DSN: "" }));

    initializeSentry();

    expect(sentrySdkHelpers.initSentrySdk).not.toHaveBeenCalled();
  });

  it("should initialize the tracker with the built options when a DSN is configured.", () => {
    const appEnv = createFakeAppEnv({
      SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
      SENTRY_ENVIRONMENT: "staging",
    });
    vi.spyOn(configModuleHelpers, "getAppEnv").mockReturnValue(appEnv);

    initializeSentry();

    expect(sentrySdkHelpers.initSentrySdk).toHaveBeenCalledExactlyOnceWith(createSentryInitOptions(appEnv));
  });
});