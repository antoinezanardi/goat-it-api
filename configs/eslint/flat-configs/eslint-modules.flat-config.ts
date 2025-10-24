import type { Linter } from "eslint";

const ESLINT_MODULES_FLAT_CONFIG: Linter.Config = {
  name: "modules",
  files: ["src/**/*.module.ts"],
  rules: {
    "new-cap": ["error", { capIsNewExceptions: ["Module"] }],
  },
} as const;

export { ESLINT_MODULES_FLAT_CONFIG };