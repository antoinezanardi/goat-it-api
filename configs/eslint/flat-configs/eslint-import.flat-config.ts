import { importX } from "eslint-plugin-import-x";

import { ESLINT_IGNORES } from "../eslint.constants";

import type { Linter } from "eslint";

const ESLINT_IMPORT_FLAT_CONFIG: Linter.Config = {
  name: "import",
  languageOptions: {
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  ignores: ESLINT_IGNORES,
  plugins: {
    "import-x": importX,
  },
  settings: {
    "import-x/parsers": {
      "espree": [".js", ".cjs", ".mjs", ".jsx"],
      "@typescript-eslint/parser": [".ts", ".tsx", ".mts", ".cts"],
    },
    "import-x/resolver": {
      typescript: {
        project: ["./configs/typescript/tsconfig.eslint.json"],
        alwaysTryTypes: true,
      },
      node: true,
    },
  },
  rules: {
    // ---- ESLint Import Rules -----
    // - Helpful warnings (https://github.com/import-js/eslint-plugin-import#helpful-warnings)
    "import-x/export": "error",
    "import-x/no-deprecated": "error",
    "import-x/no-extraneous-dependencies": ["error", { peerDependencies: false }],
    "import-x/no-rename-default": "off",
    "import-x/no-unused-modules": "off",
    // - Module systems (https://github.com/import-js/eslint-plugin-import#module-systems)
    "import-x/no-import-module-exports": "error",
    "import-x/no-nodejs-modules": "off",
    // - Static analysis (https://github.com/import-js/eslint-plugin-import#static-analysis)
    "import-x/named": "off",
    "import-x/no-internal-modules": "off",
    "import-x/no-relative-packages": "error",
    "import-x/no-relative-parent-imports": "off",
    "import-x/no-restricted-paths": "error",
    "import-x/no-unresolved": "error",
    "import-x/no-useless-path-segments": "error",
    // // - Style guide (https://github.com/import-js/eslint-plugin-import#style-guide)
    "import-x/dynamic-import-chunkname": "off",
    "import-x/extensions": "off",
    "import-x/no-named-export": "off",
    "import-x/prefer-default-export": "off",
    "import-x/prefer-namespace-import": "error",
    "import-x/order": [
      "error",
      {
        "warnOnUnassignedImports": true,
        "groups": ["builtin", "external", "internal", "parent", "sibling", "type"],
        "pathGroups": [
          { pattern: "**/*.types", group: "type", position: "after" },
          { pattern: "@package-json", group: "parent", position: "before" },
          { pattern: "@src/**", group: "parent", position: "after" },
          { pattern: "@app/**", group: "parent", position: "after" },
          { pattern: "@shared/**", group: "parent", position: "after" },
          { pattern: "@configs/**", group: "parent", position: "after" },
          { pattern: "@question/**", group: "parent", position: "after" },
          { pattern: "@unit-tests/**", group: "sibling", position: "after" },
          { pattern: "@mocks/**", group: "sibling", position: "after" },
          { pattern: "@faketories/**", group: "sibling", position: "after" },
          { pattern: "@test-helpers/**", group: "sibling", position: "after" },
          { pattern: "@acceptance-tests/**", group: "sibling", position: "after" },
          { pattern: "@acceptance-features/**", group: "sibling", position: "after" },
          { pattern: "@acceptance-support/**", group: "sibling", position: "after" },
        ],
        "newlines-between": "always",
      },
    ],
  },
} as const;

export { ESLINT_IMPORT_FLAT_CONFIG };