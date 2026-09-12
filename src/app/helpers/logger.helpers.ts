import type { Params as PinoParameters } from "nestjs-pino";

function getLoggerConfiguration(): PinoParameters {
  return {
    pinoHttp: {
      transport: process.env.NODE_ENV === "production" ? undefined : { target: "pino-pretty" },
    },
  };
}

export { getLoggerConfiguration };