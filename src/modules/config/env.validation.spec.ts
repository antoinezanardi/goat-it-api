import { validate } from "@modules/config/env.validation";

import type { Env } from "@modules/config/env.types";

describe("Env Validation", () => {
  describe(validate, () => {
    it("should return parsed env when config is valid with all fields.", () => {
      const config = {
        PORT: "4000",
        HOST: "192.168.1.1",
      };

      expect(validate(config)).toStrictEqual<Env>({
        PORT: 4000,
        HOST: "192.168.1.1",
      });
    });

    it("should return parsed env with default PORT when PORT is not provided.", () => {
      const config = {
        HOST: "192.168.1.1",
      };

      expect(validate(config)).toStrictEqual<Env>({
        PORT: 3000,
        HOST: "192.168.1.1",
      });
    });

    it("should return parsed env with default HOST when HOST is not provided.", () => {
      const config = {
        PORT: "5000",
      };

      expect(validate(config)).toStrictEqual<Env>({
        PORT: 5000,
        HOST: "0.0.0.0",
      });
    });

    it("should return parsed env with all defaults when config is empty.", () => {
      const config = {};

      expect(validate(config)).toStrictEqual<Env>({
        PORT: 3000,
        HOST: "0.0.0.0",
      });
    });

    it("should coerce PORT from string to number when PORT is a valid numeric string.", () => {
      const config = {
        PORT: "8080",
        HOST: "0.0.0.0",
      };

      expect(validate(config)).toStrictEqual<Env>({
        PORT: 8080,
        HOST: "0.0.0.0",
      });
    });

    it("should coerce PORT from number to number when PORT is already a number.", () => {
      const config = {
        PORT: 9000,
        HOST: "0.0.0.0",
      };

      expect(validate(config)).toStrictEqual<Env>({
        PORT: 9000,
        HOST: "0.0.0.0",
      });
    });

    it("should throw error when PORT is not a valid number.", () => {
      const config = {
        PORT: "invalid",
        HOST: "0.0.0.0",
      };

      expect(() => validate(config)).toThrow("Invalid environment variables");
    });

    it("should throw error when HOST is not a string.", () => {
      const config = {
        PORT: "3000",
        HOST: 12_345,
      };

      expect(() => validate(config)).toThrow("Invalid environment variables");
    });

    it("should throw error when config contains invalid types for both PORT and HOST.", () => {
      const config = {
        PORT: "not-a-number",
        HOST: true,
      };

      expect(() => validate(config)).toThrow("Invalid environment variables");
    });

    it("should return parsed env when config contains additional properties.", () => {
      const config = {
        PORT: "3000",
        HOST: "http://localhost",
        EXTRA_FIELD: "should be ignored",
      };

      expect(validate(config)).toStrictEqual<Env>({
        PORT: 3000,
        HOST: "http://localhost",
      });
    });
  });
});