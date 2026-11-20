import { getClient } from "@sentry/nestjs";

import { captureSentryException, closeSentryClient, initSentrySdk } from "@src/infrastructure/api/observability/sentry/helpers/sentry-sdk.helpers";

import type { SentryErrorEvent } from "@src/infrastructure/api/observability/sentry/helpers/sentry.helpers.types";

const SENTRY_EVENT_ID_PATTERN = /^[0-9a-f]{32}$/u;

describe(initSentrySdk, () => {
  afterEach(async() => {
    await closeSentryClient(1000);
  });

  it("should initialize a tracker client when called without a DSN.", () => {
    initSentrySdk({ defaultIntegrations: false });

    expect(getClient()).toBeDefined();
  });
});

describe(captureSentryException, () => {
  let capturedEvent: SentryErrorEvent | null;

  beforeEach(() => {
    capturedEvent = null;
  });

  afterEach(async() => {
    await closeSentryClient(1000);
  });

  it("should attach the provided tags to the captured event when called.", () => {
    initSentrySdk({
      defaultIntegrations: false,
      beforeSend: event => {
        capturedEvent = event;

        return null;
      },
    });

    captureSentryException(new Error("Explosive secret value"), {
      "errorClass": "QuestionCreationError",
      "http.route": "/admin/questions",
    });

    expect(capturedEvent?.tags).toStrictEqual({
      "errorClass": "QuestionCreationError",
      "http.route": "/admin/questions",
    });
  });

  it("should return an event id when called.", () => {
    expect(captureSentryException(new Error("Explosive secret value"), {})).toMatch(SENTRY_EVENT_ID_PATTERN);
  });
});

describe(closeSentryClient, () => {
  it("should resolve false when no tracker client is initialized.", async() => {
    await expect(closeSentryClient(2000)).resolves.toBe(false);
  });
});