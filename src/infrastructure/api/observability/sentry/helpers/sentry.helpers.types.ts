import type { NodeOptions, onUncaughtExceptionIntegration } from "@sentry/nestjs";

type SentryErrorEvent = Parameters<NonNullable<NodeOptions["beforeSend"]>>[0];

type SentryTags = NonNullable<SentryErrorEvent["tags"]>;

type SentryExceptionValue = NonNullable<NonNullable<SentryErrorEvent["exception"]>["values"]>[number];

type SentryStackFrame = NonNullable<NonNullable<SentryExceptionValue["stacktrace"]>["frames"]>[number];

type SentryIntegrationsFactory = Exclude<NonNullable<NodeOptions["integrations"]>, unknown[]>;

type SentryIntegration = Parameters<SentryIntegrationsFactory>[0][number];

type SentryUncaughtExceptionIntegrationOptions = Parameters<typeof onUncaughtExceptionIntegration>[0];

type SentryErrorContext = {
  errorClass: string;
  route: string;
  method: string;
};

export type {
  SentryErrorEvent,
  SentryTags,
  SentryExceptionValue,
  SentryStackFrame,
  SentryIntegration,
  SentryUncaughtExceptionIntegrationOptions,
  SentryErrorContext,
};