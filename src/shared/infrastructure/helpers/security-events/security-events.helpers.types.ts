/**
 * Allow-listed reason recorded on an `auth.failed` security event.
 */
type AuthFailureReason = "missing" | "invalid" | "unknown";

/**
 * Allow-listed fields recorded on an `auth.failed` security event.
 */
type AuthFailedSecurityEventContext = {
  /**
   * Matched Fastify route template (for example `/questions/:id`), never the raw request URL.
   */
  route: string;
  audience: "admin" | "game";
  reason: AuthFailureReason;
};

/**
 * Allow-listed fields recorded on a `request.validation.failed` security event.
 */
type RequestValidationFailedSecurityEventContext = {
  /**
   * Matched Fastify route template (for example `/questions/:id`), never the raw request URL.
   */
  route: string;
  issueCount: number;
};

/**
 * Allow-listed fields recorded on a `request.throttled` security event.
 */
type RequestThrottledSecurityEventContext = {
  /**
   * Matched Fastify route template (for example `/questions/:id`), never the raw request URL.
   */
  route: string;
  retryAfterSeconds: number;
};

/**
 * Allow-listed fields recorded on a `request.error` security event.
 */
type RequestErrorSecurityEventContext = {
  /**
   * Matched Fastify route template (for example `/questions/:id`), never the raw request URL.
   */
  route: string;
  errorClass: string;
  /**
   * V8 stack frame lines only; the stack header that embeds the exception message is never included.
   */
  stack?: string;
};

/**
 * Minimal request shape needed to read the matched Fastify route template.
 */
type SecurityEventRouteCarrier = {
  routeOptions?: {
    /**
     * Matched route template, `undefined` when the request did not match a route.
     */
    url?: string;
  };
};

export type {
  AuthFailedSecurityEventContext,
  AuthFailureReason,
  RequestErrorSecurityEventContext,
  RequestThrottledSecurityEventContext,
  RequestValidationFailedSecurityEventContext,
  SecurityEventRouteCarrier,
};