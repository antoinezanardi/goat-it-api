import { HttpStatus } from "@nestjs/common";

const NON_ERROR_THROWN = "NonErrorThrown";

const UNKNOWN_SENTRY_CONTEXT_VALUE = "unknown";

const SENTRY_CAPTURE_FAILED_LOG_MESSAGE = "Failed to report an unexpected error to Sentry";

const GENERIC_INTERNAL_SERVER_ERROR_BODY = {
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  message: "Internal Server Error",
  error: "Internal Server Error",
} as const;

export {
  GENERIC_INTERNAL_SERVER_ERROR_BODY,
  NON_ERROR_THROWN,
  UNKNOWN_SENTRY_CONTEXT_VALUE,
  SENTRY_CAPTURE_FAILED_LOG_MESSAGE,
};