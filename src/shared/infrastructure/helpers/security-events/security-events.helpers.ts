import { SECURITY_EVENT, SECURITY_EVENT_MESSAGE, SECURITY_EVENT_STATUS } from "@shared/infrastructure/helpers/security-events/constants/security-events.constants";

import type { LoggerService } from "@nestjs/common";
import type {
  AuthFailedSecurityEventContext,
  RequestErrorSecurityEventContext,
  RequestThrottledSecurityEventContext,
  RequestValidationFailedSecurityEventContext,
  SecurityEventRouteCarrier,
} from "@shared/infrastructure/helpers/security-events/security-events.helpers.types";

/**
 * Returns the matched Fastify route pattern, or `unknown` when the request did not match a route.
 */
function getSecurityEventRoute(request: SecurityEventRouteCarrier): string {
  return request.routeOptions?.url ?? "unknown";
}

/**
 * Emits `auth.failed` when an API-key guard rejects a request.
 *
 * Only the event name, status, route pattern, audience and failure reason are recorded; the key is never included.
 */
function logAuthFailedEvent(logger: LoggerService, context: AuthFailedSecurityEventContext): void {
  logger.warn({
    event: SECURITY_EVENT.authFailed,
    status: SECURITY_EVENT_STATUS.authFailed,
    route: context.route,
    audience: context.audience,
    reason: context.reason,
  }, SECURITY_EVENT_MESSAGE.authFailed);
}

/**
 * Emits `request.validation.failed` when the Zod pipe rejects a payload.
 *
 * Only the issue count is recorded; the body and its field values are never included.
 */
function logRequestValidationFailedEvent(logger: LoggerService, context: RequestValidationFailedSecurityEventContext): void {
  logger.warn({
    event: SECURITY_EVENT.requestValidationFailed,
    status: SECURITY_EVENT_STATUS.requestValidationFailed,
    route: context.route,
    issueCount: context.issueCount,
  }, SECURITY_EVENT_MESSAGE.requestValidationFailed);
}

/**
 * Emits `request.throttled` when the rate limiter rejects a request.
 *
 * Only the route pattern and the retry delay are recorded; no client identity, key or counter is included.
 */
function logRequestThrottledEvent(logger: LoggerService, context: RequestThrottledSecurityEventContext): void {
  logger.warn({
    event: SECURITY_EVENT.requestThrottled,
    status: SECURITY_EVENT_STATUS.requestThrottled,
    route: context.route,
    retryAfterSeconds: context.retryAfterSeconds,
  }, SECURITY_EVENT_MESSAGE.requestThrottled);
}

/**
 * Emits `request.error` when an unexpected exception reaches the generic 500.
 *
 * The optional stack carries frame lines only; the exception message is never recorded.
 */
function logRequestErrorEvent(logger: LoggerService, context: RequestErrorSecurityEventContext): void {
  logger.error({
    event: SECURITY_EVENT.requestError,
    status: SECURITY_EVENT_STATUS.requestError,
    route: context.route,
    errorClass: context.errorClass,
    ...context.stack !== undefined && { stack: context.stack },
  }, SECURITY_EVENT_MESSAGE.requestError);
}

export {
  getSecurityEventRoute,
  logAuthFailedEvent,
  logRequestErrorEvent,
  logRequestThrottledEvent,
  logRequestValidationFailedEvent,
};