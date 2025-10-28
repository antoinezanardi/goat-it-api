import { getLoggerConfiguration } from "@app/helpers/logger.helpers";

import type { Params as PinoParameters } from "nestjs-pino/params";

describe("Logger Helpers", () => {
  describe(getLoggerConfiguration, () => {
    afterEach(() => {
      process.env.NODE_ENV = "TEST";
    });

    it("should return logger production configuration when env is production.", () => {
      process.env.NODE_ENV = "production";

      const config = getLoggerConfiguration();
      const expectedConfig: PinoParameters = {
        pinoHttp: {
          transport: undefined,
        },
      };

      expect(config).toStrictEqual<PinoParameters>(expectedConfig);
    });

    it("should return logger development configuration when env is not production.", () => {
      process.env.NODE_ENV = "development";
      const config = getLoggerConfiguration();
      const expectedConfig: PinoParameters = {
        pinoHttp: {
          transport: { target: "pino-pretty" },
        },
      };

      expect(config).toStrictEqual<PinoParameters>(expectedConfig);
    });
  });
});