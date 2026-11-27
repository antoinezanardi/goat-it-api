const SECURITY_EVENT = {
  authFailed: "auth.failed",
  requestValidationFailed: "request.validation.failed",
  requestThrottled: "request.throttled",
  requestError: "request.error",
} as const;

const SECURITY_EVENT_MESSAGE = {
  authFailed: "API key authentication failed",
  requestValidationFailed: "Request validation failed",
  requestThrottled: "Request throttled",
  requestError: "Unhandled request error",
} as const;

const SECURITY_EVENT_STATUS = {
  authFailed: 401,
  requestValidationFailed: 400,
  requestThrottled: 429,
  requestError: 500,
} as const;

export {
  SECURITY_EVENT,
  SECURITY_EVENT_MESSAGE,
  SECURITY_EVENT_STATUS,
};