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
    "import-x/no-empty-named-blocks": "error",
    "import-x/no-extraneous-dependencies": ["error", { peerDependencies: false }],
    "import-x/no-mutable-exports": "error",
    "import-x/no-named-as-default": "error",
    "import-x/no-named-as-default-member": "error",
    "import-x/no-unused-modules": "error",
    // - Module systems (https://github.com/import-js/eslint-plugin-import#module-systems)
    "import-x/no-amd": "error",
    "import-x/no-commonjs": "error",
    "import-x/no-import-module-exports": "error",
    "import-x/no-nodejs-modules": "off",
    "import-x/unambiguous": "error",
    // - Static analysis (https://github.com/import-js/eslint-plugin-import#static-analysis)
    "import-x/default": "error",
    "import-x/named": "off",
    "import-x/namespace": "error",
    "import-x/no-absolute-path": "error",
    "import-x/no-cycle": "error",
    "import-x/no-dynamic-require": "error",
    "import-x/no-internal-modules": "off",
    "import-x/no-relative-packages": "error",
    "import-x/no-relative-parent-imports": "off",
    "import-x/no-restricted-paths": "error",
    "import-x/no-self-import": "error",
    "import-x/no-unresolved": "error",
    "import-x/no-useless-path-segments": "error",
    "import-x/no-webpack-loader-syntax": "error",
    // // - Style guide (https://github.com/import-js/eslint-plugin-import#style-guide)
    "import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "import-x/dynamic-import-chunkname": "off",
    "import-x/exports-last": "error",
    "import-x/extensions": "off",
    "import-x/first": "error",
    "import-x/group-exports": "error",
    "import-x/max-dependencies": [
      "error",
      {
        max: 25,
        ignoreTypeImports: true,
      },
    ],
    "import-x/newline-after-import": "error",
    "import-x/no-anonymous-default-export": "error",
    "import-x/no-default-export": "error",
    "import-x/no-duplicates": "error",
    "import-x/no-named-default": "error",
    "import-x/no-named-export": "off",
    "import-x/no-namespace": "error",
    "import-x/no-unassigned-import": ["error", { allow: ["reflect-metadata"] }],
    "import-x/prefer-default-export": "off",
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