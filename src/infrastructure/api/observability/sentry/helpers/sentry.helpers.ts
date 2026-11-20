import { fastifyIntegration, onUncaughtExceptionIntegration } from "@sentry/nestjs";

import { DEFAULT_ENV_SENTRY_DSN } from "@src/infrastructure/api/config/constants/env.constants";
import { getAppEnv } from "@src/infrastructure/api/config/helpers/config-module.helpers";
import { SENTRY_ALLOWED_TAG_NAMES, SENTRY_ERROR_CLASS_TAG, SENTRY_FATAL_EXIT_CODE, SENTRY_INTERNAL_SERVER_ERROR_STATUS_CODE, SENTRY_MAX_BREADCRUMBS, SENTRY_METHOD_TAG, SENTRY_REDACTED_VALUE, SENTRY_ROUTE_TAG, SENTRY_SHUTDOWN_TIMEOUT_MS, SENTRY_STACK_LINE_SEPARATOR, SENTRY_STATUS_CODE_TAG, SENTRY_UNCAUGHT_EXCEPTION_INTEGRATION_NAME, SENTRY_UNHANDLED_REJECTION_INTEGRATION_NAME } from "@src/infrastructure/api/observability/sentry/constants/sentry.constants";
import { captureSentryException, closeSentryClient, initSentrySdk } from "@src/infrastructure/api/observability/sentry/helpers/sentry-sdk.helpers";

import { readPackageJson } from "@shared/infrastructure/helpers/package-json/package-json.helpers";

import type { NodeOptions } from "@sentry/nestjs";

import type { AppEnv } from "@src/infrastructure/api/config/types/env.types";
import type { SentryErrorContext, SentryErrorEvent, SentryExceptionValue, SentryIntegration, SentryStackFrame, SentryTags, SentryUncaughtExceptionIntegrationOptions } from "@src/infrastructure/api/observability/sentry/helpers/sentry.helpers.types";

function pickAllowedSentryTags(tags: SentryErrorEvent["tags"]): SentryTags {
  const allowedTags: SentryTags = {};

  for (const tagName of SENTRY_ALLOWED_TAG_NAMES) {
    const tagValue = tags?.[tagName];
    if (tagValue !== undefined) {
      allowedTags[tagName] = tagValue;
    }
  }
  return allowedTags;
}

function createRedactedSentryStackFrame(frame: SentryStackFrame): SentryStackFrame {
  return {
    filename: frame.filename,
    function: frame.function,
    lineno: frame.lineno,
    colno: frame.colno,
    in_app: frame.in_app,
  };
}

function createRedactedSentryExceptionValue(exceptionValue: SentryExceptionValue): SentryExceptionValue {
  const frames = exceptionValue.stacktrace?.frames;

  return {
    type: exceptionValue.type,
    value: SENTRY_REDACTED_VALUE,
    stacktrace: {
      frames: frames === undefined ? [] : frames.map(createRedactedSentryStackFrame),
    },
  };
}

/**
 * Rebuilds the event from an allow-list instead of deleting known fields, so an unknown SDK field can never leak.
 *
 * Returns `null` when the event carries no exception value, which drops it.
 */
function createRedactedSentryEvent(event: SentryErrorEvent): SentryErrorEvent | null {
  const exceptionValues = event.exception?.values;

  if (exceptionValues === undefined || exceptionValues.length === 0) {
    // Acceptable as the SDK's send hook only accepts an event or null
    // oxlint-disable-next-line unicorn/no-null
    return null;
  }
  return {
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
    tags: pickAllowedSentryTags(event.tags),
    exception: {
      values: exceptionValues.map(createRedactedSentryExceptionValue),
    },
  };
}

/**
 * Drops every breadcrumb so no navigation trail reaches the tracker.
 */
function dropSentryBreadcrumb(): null {
  // Acceptable as the SDK's breadcrumb hook only accepts a breadcrumb or null
  // oxlint-disable-next-line unicorn/no-null
  return null;
}

/**
 * Drops the message-bearing first line of a V8 stack, keeping the frames only.
 */
function removeFirstStackLine(stack: string): string {
  const [, ...remainingStackLines] = stack.split(SENTRY_STACK_LINE_SEPARATOR);

  return remainingStackLines.join(SENTRY_STACK_LINE_SEPARATOR);
}

/**
 * Builds the synthetic error reported to the tracker: a fixed redacted message, the given error class and a stack without its first line.
 *
 * A value that carries no stack keeps the stack captured when the redacted error is constructed, so the reported error always has frames.
 */
function createRedactedSentryError(exception: unknown, errorClass: string): Error {
  const redactedError = new Error(SENTRY_REDACTED_VALUE);
  // Acceptable as the reported error must carry the original class name instead of "Error"
  // eslint-disable-next-line unicorn/no-error-property-assignment
  redactedError.name = errorClass;

  const originalStack = Error.isError(exception) ? exception.stack : undefined;
  if (originalStack !== undefined) {
    // Acceptable as the frames must survive without the message-bearing first line
    // eslint-disable-next-line unicorn/no-error-property-assignment
    redactedError.stack = removeFirstStackLine(originalStack);
  }
  return redactedError;
}

function createSentryErrorTags(context: SentryErrorContext): Record<string, string> {
  return {
    [SENTRY_ERROR_CLASS_TAG]: context.errorClass,
    [SENTRY_ROUTE_TAG]: context.route,
    [SENTRY_METHOD_TAG]: context.method,
    [SENTRY_STATUS_CODE_TAG]: SENTRY_INTERNAL_SERVER_ERROR_STATUS_CODE,
  };
}

/**
 * Reports one redacted event for an unexpected server error, carrying the four controlled tags only.
 */
function captureServerError(exception: unknown, context: SentryErrorContext): void {
  captureSentryException(createRedactedSentryError(exception, context.errorClass), createSentryErrorTags(context));
}

/**
 * Initializes the tracker once at bootstrap, and stays a no-op when no DSN is configured.
 */
function initializeSentry(): void {
  const appEnv = getAppEnv();

  if (appEnv.SENTRY_DSN === DEFAULT_ENV_SENTRY_DSN) {
    return;
  }
  initSentrySdk(createSentryInitOptions(appEnv));
}

/**
 * Returns the safe uncaught-exception policy: no forced exit when another listener exists, and a bounded client close followed by exit code 1.
 */
function createUncaughtExceptionIntegrationOptions(): NonNullable<SentryUncaughtExceptionIntegrationOptions> {
  return {
    exitEvenIfOtherHandlersAreRegistered: false,
    onFatalError: (): void => {
      void handleSentryFatalError();
    },
  };
}

/**
 * Closes the tracker client with a bounded wait, then terminates the process without printing the fatal error.
 */
async function handleSentryFatalError(): Promise<void> {
  try {
    await closeSentryClient(SENTRY_SHUTDOWN_TIMEOUT_MS);
  } finally {
    // Acceptable as the fatal error path must terminate the process after the bounded client close
    // oxlint-disable-next-line unicorn/no-process-exit
    process.exit(SENTRY_FATAL_EXIT_CODE);
  }
}

/**
 * Replaces the SDK's process integrations: the Fastify auto-capture, the unhandled-rejection listener and the default uncaught-exception handler are dropped, and the safe fatal handler is appended.
 */
function createSentryIntegrations(defaultIntegrations: SentryIntegration[]): SentryIntegration[] {
  const removedIntegrationNames = new Set([fastifyIntegration().name, SENTRY_UNHANDLED_REJECTION_INTEGRATION_NAME, SENTRY_UNCAUGHT_EXCEPTION_INTEGRATION_NAME]);
  const keptIntegrations = defaultIntegrations.filter(integration => !removedIntegrationNames.has(integration.name));

  return [
    ...keptIntegrations,
    onUncaughtExceptionIntegration(createUncaughtExceptionIntegrationOptions()),
  ];
}

/**
 * Builds the SDK options: every data-collection surface denied, no breadcrumb, tracing left unconfigured, no server name, the allow-list scrubbers and the safe integrations.
 *
 * The release is the version of the `package.json` shipped in the runtime image, so no build-time variable is needed. `tracesSampleRate` and `tracesSampler` are deliberately absent: any defined rate would enable tracing.
 */
function createSentryInitOptions(appEnv: AppEnv): NodeOptions {
  return {
    dsn: appEnv.SENTRY_DSN,
    environment: appEnv.SENTRY_ENVIRONMENT,
    release: readPackageJson().version,
    includeServerName: false,
    maxBreadcrumbs: SENTRY_MAX_BREADCRUMBS,
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
}

export {
  captureServerError,
  createRedactedSentryError,
  createRedactedSentryEvent,
  createSentryInitOptions,
  createSentryIntegrations,
  createUncaughtExceptionIntegrationOptions,
  dropSentryBreadcrumb,
  handleSentryFatalError,
  initializeSentry,
};