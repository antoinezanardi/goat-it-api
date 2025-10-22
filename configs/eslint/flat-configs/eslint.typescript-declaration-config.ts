import type { Linter } from "eslint";

const ESLINT_TYPESCRIPT_DECLARATION_CONFIG: Linter.Config = {
  name: "typescript-declaration",
  files: ["**/*.d.ts"],
  rules: {
    "import/unambiguous": "off",
  },
} as const;

export { ESLINT_TYPESCRIPT_DECLARATION_CONFIG };