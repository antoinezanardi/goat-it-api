import type { Params as PinoParameters } from "nestjs-pino";

/**
 * Builds the Pino parameters: pretty-printed output outside production, and raw JSON in production where no transport is configured.
 */
function getLoggerConfiguration(): PinoParameters {
  return {
    pinoHttp: {
      transport: process.env.NODE_ENV === "production" ? undefined : { target: "pino-pretty" },
    },
  };
}

export { getLoggerConfiguration };