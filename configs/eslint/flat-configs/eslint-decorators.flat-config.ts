import { NAMING_CONVENTION_DEFAULT_CONFIG } from "../eslint.constants";

import type { Linter } from "eslint";

const ESLINT_DECORATORS_FLAT_CONFIG: Linter.Config = {
  name: "decorators",
  files: ["src/**/*.decorator.ts"],
  rules: {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "function",
        format: ["PascalCase"],
        leadingUnderscore: "allow",
      },
      ...NAMING_CONVENTION_DEFAULT_CONFIG,
    ],
  },
} as const;

export { ESLINT_DECORATORS_FLAT_CONFIG };