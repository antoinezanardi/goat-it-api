import type { Linter } from "eslint";

const ESLINT_CONFIG_FILES_FLAT_CONFIG: Linter.Config = {
  name: "config-files",
  files: [
    "eslint.config.ts",
    "configs/**/*.{js,mjs,ts}",
  ],

  languageOptions: { globals: { CustomMatchers: "readonly" } },
  rules: {
    "@typescript-eslint/no-restricted-imports": "off",
    "import-x/no-default-export": "off",
    "import-x/no-internal-modules": "off",
    "import-x/no-anonymous-default-export": "off",
  },
} as const;

export { ESLINT_CONFIG_FILES_FLAT_CONFIG };