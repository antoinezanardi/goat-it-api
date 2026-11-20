import { consoleIntegration, fastifyIntegration, onUncaughtExceptionIntegration, onUnhandledRejectionIntegration } from "@sentry/nestjs";

import packageJson from "@package-json" with { type: "json" };

import * as configModuleHelpers from "@src/infrastructure/api/config/helpers/config-module.helpers";
import * as sentrySdkHelpers from "@src/infrastructure/api/observability/sentry/helpers/sentry-sdk.helpers";
import { captureServerError, createRedactedSentryError, createRedactedSentryEvent, createSentryInitOptions, createSentryIntegrations, createUncaughtExceptionIntegrationOptions, dropSentryBreadcrumb, handleSentryFatalError, initializeSentry } from "@src/infrastructure/api/observability/sentry/helpers/sentry.helpers";

import { createFakeAppEnv } from "@faketories/infrastructure/api/config/env.faketory";
import { createFakeSentryErrorEvent } from "@faketories/infrastructure/api/observability/sentry/sentry.faketory";

import type { NodeOptions } from "@sentry/nestjs";

import type { SentryErrorEvent } from "@src/infrastructure/api/observability/sentry/helpers/sentry.helpers.types";

const SENTRY_SECRET = "explosive secret value";

const sentrySecretOverrides: Partial<SentryErrorEvent> = {
  transaction: `/${SENTRY_SECRET}`,
  request: {
    url: `https://api.goat-it.fr/admin/questions?apiKey=${SENTRY_SECRET}`,
    method: "POST",
    headers: { "goat-it-api-key": SENTRY_SECRET },
    data: { statement: SENTRY_SECRET },
  },
  user: { id: SENTRY_SECRET, ip_address: "127.0.0.1" },
  contexts: { runtime: { name: "node", version: SENTRY_SECRET } },
  extra: { payload: SENTRY_SECRET },
  breadcrumbs: [{ message: SENTRY_SECRET }],
  modules: { mongoose: SENTRY_SECRET },
  tags: {
    "errorClass": "QuestionCreationError",
    "http.route": "/admin/questions",
    "http.request.method": "POST",
    "http.response.status_code": "500",
    "http.request.id": SENTRY_SECRET,
  },
  exception: {
    values: [
      {
        type: "QuestionCreationError",
        value: SENTRY_SECRET,
        mechanism: { type: "generic", handled: false, data: { secret: SENTRY_SECRET } },
        stacktrace: {
          frames: [
            {
              filename: "/app/dist/contexts/question/question.js",
              function: "createQuestion",
              lineno: 12,
              colno: 34,
              in_app: true,
              context_line: SENTRY_SECRET,
              pre_context: [SENTRY_SECRET],
              post_context: [SENTRY_SECRET],
              vars: { secret: SENTRY_SECRET },
            },
          ],
        },
      },
    ],
  },
};

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

  it("should remove the whole message header from the original stack when called with an Error.", () => {
    const originalError = new Error("Explosive secret value");
    const messageHeader = `Error: ${originalError.message}\n`;
    const expectedStack = String(originalError.stack).slice(messageHeader.length);

    expect(createRedactedSentryError(originalError, "QuestionCreationError").stack).toBe(expectedStack);
  });

  it("should drop the frame-shaped continuation lines of a multiline message when called with an Error.", () => {
    const originalError = new Error("Failed\n    at fake (/private/token-secret:2:2)");
    const redactedStack = String(createRedactedSentryError(originalError, "QuestionCreationError").stack);

    expect(redactedStack).not.toContain("token-secret");
  });

  it("should keep only the original frames of an Error carrying a multiline message when called.", () => {
    const originalError = new Error("Failed\n    at fake (/private/token-secret:2:2)");
    const redactedStack = String(createRedactedSentryError(originalError, "QuestionCreationError").stack);

    expect(redactedStack.startsWith("    at ")).toBe(true);
  });

  it("should drop the whole stack of an Error whose stack does not start with the message header when called.", () => {
    const originalError = Object.assign(new Error("Explosive secret value"), {
      // Acceptable as this case models an Error whose stack was replaced by a foreign producer
      // eslint-disable-next-line unicorn/no-error-property-assignment
      stack: "    at createQuestion (/app/dist/question.js:12:34)",
    });

    expect(createRedactedSentryError(originalError, "QuestionCreationError").stack).toBe("");
  });

  it("should keep the frames of an Error carrying no message when called.", () => {
    const originalError = Object.assign(new Error("Explosive secret value"), {
      message: "",
      // Acceptable as this case needs the stack to match the message-less header
      // eslint-disable-next-line unicorn/no-error-property-assignment
      stack: "Error\n    at createQuestion (/app/dist/question.js:12:34)",
    });

    expect(createRedactedSentryError(originalError, "QuestionCreationError").stack).toBe("    at createQuestion (/app/dist/question.js:12:34)");
  });

  it("should build a synthetic stack when called with a value that is not an Error.", () => {
    const redactedError = createRedactedSentryError("Some unknown exception", "NonErrorThrown");

    expect(redactedError.stack).toContain("createRedactedSentryError");
  });

  it("should build a synthetic stack when the original Error carries no stack.", () => {
    const originalError = Object.assign(new Error("Explosive secret value"), {
      // Acceptable as this case models an Error whose stack was stripped by a foreign producer
      // eslint-disable-next-line unicorn/no-error-property-assignment
      stack: undefined,
    });

    expect(createRedactedSentryError(originalError, "QuestionCreationError").stack).toContain("createRedactedSentryError");
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
    const event = createFakeSentryErrorEvent();
    const exceptionValue = event.exception?.values?.[0];
    const frame = exceptionValue?.stacktrace?.frames?.[0];
    const expectedEvent: SentryErrorEvent = {
      type: undefined,
      event_id: event.event_id,
      timestamp: event.timestamp,
      level: event.level,
      platform: event.platform,
      sdk: {
        name: event.sdk?.name,
        version: event.sdk?.version,
      },
      environment: event.environment,
      release: event.release,
      tags: {
        "errorClass": event.tags?.errorClass,
        "http.route": event.tags?.["http.route"],
        "http.request.method": event.tags?.["http.request.method"],
        "http.response.status_code": event.tags?.["http.response.status_code"],
      },
      exception: {
        values: [
          {
            type: exceptionValue?.type,
            value: "[REDACTED]",
            stacktrace: {
              frames: [
                {
                  filename: frame?.filename,
                  function: frame?.function,
                  lineno: frame?.lineno,
                  colno: frame?.colno,
                  in_app: frame?.in_app,
                },
              ],
            },
          },
        ],
      },
    };

    expect(createRedactedSentryEvent(event)).toStrictEqual(expectedEvent);
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

  it("should return an empty frame list when the exception value message spans several lines when called.", () => {
    const redactedEvent = createRedactedSentryEvent(createFakeSentryErrorEvent({
      exception: {
        values: [
          {
            type: "Error",
            value: "Failed\n    at fake (/private/token-secret:2:2)",
            stacktrace: { frames: [{ filename: "/private/token-secret" }] },
          },
        ],
      },
    }));

    expect(redactedEvent?.exception?.values?.[0]?.stacktrace?.frames).toStrictEqual([]);
  });

  it("should not carry the stack of an exception value whose message spans several lines when called.", () => {
    const redactedEvent = createRedactedSentryEvent(createFakeSentryErrorEvent({
      exception: {
        values: [
          {
            type: "Error",
            value: "Failed\n    at fake (/private/token-secret:2:2)",
            stacktrace: { frames: [{ filename: "/private/token-secret" }] },
          },
        ],
      },
    }));

    expect(JSON.stringify(redactedEvent)).not.toContain("token-secret");
  });

  it("should keep the frames when the exception value carries no message when called.", () => {
    const frames = [{ filename: "/app/dist/contexts/question/question.js", function: "createQuestion", lineno: 12, colno: 34, in_app: true }];
    const redactedEvent = createRedactedSentryEvent(createFakeSentryErrorEvent({
      exception: { values: [{ type: "Error", stacktrace: { frames } }] },
    }));

    expect(redactedEvent?.exception?.values?.[0]?.stacktrace?.frames).toStrictEqual(frames);
  });

  it("should not carry any original event text when called.", () => {
    expect(JSON.stringify(createRedactedSentryEvent(createFakeSentryErrorEvent(sentrySecretOverrides)))).not.toContain(SENTRY_SECRET);
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
  const originalDebug: { value?: string } = {};

  beforeEach(() => {
    originalDebug.value = process.env.SENTRY_DEBUG;
  });

  afterEach(() => {
    if (originalDebug.value === undefined) {
      Reflect.deleteProperty(process.env, "SENTRY_DEBUG");
    } else {
      process.env.SENTRY_DEBUG = originalDebug.value;
    }
  });

  it("should return the allow-listed SDK options when called.", () => {
    const appEnv = createFakeAppEnv({
      SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
      SENTRY_ENVIRONMENT: "production",
    });
    const expectedOptions: NodeOptions = {
      dsn: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
      environment: "production",
      release: packageJson.version,
      debug: false,
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

  it("should pin the debug output off when an ambient SENTRY_DEBUG is set.", () => {
    process.env.SENTRY_DEBUG = "true";

    expect(createSentryInitOptions(createFakeAppEnv()).debug).toBe(false);
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
  const originalTracesSampleRate: { value?: string } = {};

  beforeEach(() => {
    originalTracesSampleRate.value = process.env.SENTRY_TRACES_SAMPLE_RATE;
    vi.spyOn(sentrySdkHelpers, "initSentrySdk").mockReturnValue(undefined);
  });

  afterEach(() => {
    if (originalTracesSampleRate.value === undefined) {
      Reflect.deleteProperty(process.env, "SENTRY_TRACES_SAMPLE_RATE");
    } else {
      process.env.SENTRY_TRACES_SAMPLE_RATE = originalTracesSampleRate.value;
    }
  });

  it("should not initialize the tracker when no DSN is configured.", () => {
    vi.spyOn(configModuleHelpers, "getAppEnv").mockReturnValue(createFakeAppEnv({ SENTRY_DSN: "" }));

    initializeSentry();

    expect(sentrySdkHelpers.initSentrySdk).not.toHaveBeenCalled();
  });

  it("should not initialize the tracker when the tracker is disabled with a configured DSN.", () => {
    vi.spyOn(configModuleHelpers, "getAppEnv").mockReturnValue(createFakeAppEnv({
      SENTRY_DISABLED: true,
      SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
    }));

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

  it("should remove the ambient traces sample rate when a DSN is configured.", () => {
    process.env.SENTRY_TRACES_SAMPLE_RATE = "1";
    vi.spyOn(configModuleHelpers, "getAppEnv").mockReturnValue(createFakeAppEnv({ SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42" }));

    initializeSentry();

    expect(process.env.SENTRY_TRACES_SAMPLE_RATE).toBeUndefined();
  });

  it("should initialize the tracker once when an ambient traces sample rate is set and a DSN is configured.", () => {
    process.env.SENTRY_TRACES_SAMPLE_RATE = "1";
    const appEnv = createFakeAppEnv({ SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42" });
    vi.spyOn(configModuleHelpers, "getAppEnv").mockReturnValue(appEnv);

    initializeSentry();

    expect(sentrySdkHelpers.initSentrySdk).toHaveBeenCalledExactlyOnceWith(createSentryInitOptions(appEnv));
  });
});