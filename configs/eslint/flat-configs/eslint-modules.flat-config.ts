import type { Linter } from "eslint";

const ESLINT_MODULES_FLAT_CONFIG = {
  name: "modules",
  files: ["src/**/*.module.ts"],
  rules: {
    "new-cap": ["error", { capIsNewExceptions: ["Module"] }],
  },
} satisfies Linter.Config;

export { ESLINT_MODULES_FLAT_CONFIG };