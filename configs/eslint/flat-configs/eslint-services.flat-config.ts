import type { Linter } from "eslint";

const ESLINT_SERVICES_FLAT_CONFIG: Linter.Config = {
  name: "services",
  files: ["src/**/*.service.ts"],
  rules: {
    "new-cap": [
      "error",
      {
        capIsNewExceptions: ["Injectable"],
      },
    ],
  },
} as const;

export { ESLINT_SERVICES_FLAT_CONFIG };