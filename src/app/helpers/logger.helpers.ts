import { LOGGER_REDACTION_CENSOR, LOGGER_REDACTION_PATHS } from "@app/helpers/constants/logger.constants";

import type { Params as PinoParameters } from "nestjs-pino";

import type { LoggedRequest, LoggedResponse } from "@app/helpers/logger.helpers.types";

function serializeRequestForLogging(request: LoggedRequest): LoggedRequest {
  return {
    id: request.id,
    method: request.method,
    url: request.url?.split("?", 1)[0],
  };
}

function serializeResponseForLogging(response: LoggedResponse): LoggedResponse {
  return { statusCode: response.statusCode };
}

/**
 * Builds the Pino parameters: request logs keep only the request id, method and path without the query string, response logs keep only the status code, credential fields are redacted, and output is pretty-printed outside production.
 */
function getLoggerConfiguration(): PinoParameters {
  return {
    pinoHttp: {
      serializers: {
        req: serializeRequestForLogging,
        res: serializeResponseForLogging,
      },
      redact: {
        paths: [...LOGGER_REDACTION_PATHS],
        censor: LOGGER_REDACTION_CENSOR,
      },
      transport: process.env.NODE_ENV === "production" ? undefined : { target: "pino-pretty" },
    },
  };
}

export { getLoggerConfiguration };