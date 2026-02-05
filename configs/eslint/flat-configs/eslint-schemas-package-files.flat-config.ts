import type { Linter } from "eslint";

const ESLINT_SCHEMAS_PACKAGES_FILES_FLAT_CONFIG: Linter.Config = {
  name: "schemas-package-files",
  files: ["packages/schemas/**/*.ts"],
  rules: {
    "import/no-extraneous-dependencies": "off",
  },
} as const;

export { ESLINT_SCHEMAS_PACKAGES_FILES_FLAT_CONFIG };