import { getLoggerConfiguration } from "@app/helpers/logger.helpers";

import type { Params as PinoParameters } from "nestjs-pino";

describe(getLoggerConfiguration, () => {
  afterEach(() => {
    process.env.NODE_ENV = "TEST";
  });

  it.each<{ test: string; nodeEnv: string; expectedConfig: PinoParameters }>([
    {
      test: "should return logger production configuration when env is production.",
      nodeEnv: "production",
      expectedConfig: {
        pinoHttp: {
          transport: undefined,
        },
      },
    },
    {
      test: "should return logger development configuration when env is not production.",
      nodeEnv: "development",
      expectedConfig: {
        pinoHttp: {
          transport: { target: "pino-pretty" },
        },
      },
    },
  ])("$test", ({ nodeEnv, expectedConfig }) => {
    process.env.NODE_ENV = nodeEnv;

    const config = getLoggerConfiguration();

    expect(config).toStrictEqual(expectedConfig);
  });
});