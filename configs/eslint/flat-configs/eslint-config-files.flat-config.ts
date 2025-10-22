import type { Linter } from "eslint";

const ESLINT_CONFIG_FILES_FLAT_CONFIG = {
  name: "config-files",
  files: [
    "eslint.config.ts",
    "configs/**/*.{js,mjs,ts}",
  ],

  languageOptions: { globals: { CustomMatchers: "readonly" } },
  rules: {
    "@typescript-eslint/no-restricted-imports": "off",
    "import/no-default-export": "off",
    "import/no-internal-modules": "off",
    "import/no-anonymous-default-export": "off",
  },
} satisfies Linter.Config;

export { ESLINT_CONFIG_FILES_FLAT_CONFIG };