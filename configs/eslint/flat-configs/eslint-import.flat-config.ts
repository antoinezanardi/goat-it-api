import ImportPlugin from "eslint-plugin-import";

import { ESLINT_IGNORES } from "../eslint.constants";

import type { Linter } from "eslint";

const ESLINT_IMPORT_FLAT_CONFIG: Linter.Config = {
  ...ImportPlugin.flatConfigs.recommended,
  name: "import",
  languageOptions: {
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  ignores: ESLINT_IGNORES,
  settings: {
    "import/parsers": {
      "espree": [".js", ".cjs", ".mjs", ".jsx"],
      "@typescript-eslint/parser": [".ts", ".tsx", ".mts", ".cts"],
    },
    "import/resolver": {
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
    "import/export": "error",
    "import/no-deprecated": "error",
    "import/no-empty-named-blocks": "error",
    "import/no-extraneous-dependencies": ["error", { peerDependencies: false }],
    "import/no-mutable-exports": "error",
    "import/no-named-as-default": "error",
    "import/no-named-as-default-member": "error",
    "import/no-unused-modules": "error",
    // - Module systems (https://github.com/import-js/eslint-plugin-import#module-systems)
    "import/no-amd": "error",
    "import/no-commonjs": "error",
    "import/no-import-module-exports": "error",
    "import/no-nodejs-modules": "off",
    "import/unambiguous": "error",
    // - Static analysis (https://github.com/import-js/eslint-plugin-import#static-analysis)
    "import/default": "error",
    "import/enforce-node-protocol-usage": ["error", "always"],
    "import/named": "off",
    "import/namespace": "error",
    "import/no-absolute-path": "error",
    "import/no-cycle": "error",
    "import/no-dynamic-require": "error",
    "import/no-internal-modules": "off",
    "import/no-relative-packages": "error",
    "import/no-relative-parent-imports": "off",
    "import/no-restricted-paths": "error",
    "import/no-self-import": "error",
    "import/no-unresolved": "error",
    "import/no-useless-path-segments": "error",
    "import/no-webpack-loader-syntax": "error",
    // // - Style guide (https://github.com/import-js/eslint-plugin-import#style-guide)
    "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    "import/dynamic-import-chunkname": "off",
    "import/exports-last": "error",
    "import/extensions": "off",
    "import/first": "error",
    "import/group-exports": "error",
    "import/max-dependencies": [
      "error",
      {
        max: 25,
        ignoreTypeImports: true,
      },
    ],
    "import/newline-after-import": "error",
    "import/no-anonymous-default-export": "error",
    "import/no-default-export": "error",
    "import/no-duplicates": "error",
    "import/no-named-default": "error",
    "import/no-named-export": "off",
    "import/no-namespace": "error",
    "import/no-unassigned-import": ["error", { allow: ["reflect-metadata"] }],
    "import/prefer-default-export": "off",
    "import/order": [
      "error",
      {
        "warnOnUnassignedImports": true,
        "groups": ["builtin", "external", "internal", "parent", "sibling", "type"],
        "pathGroups": [
          { pattern: "**/*.types", group: "type", position: "after" },
          { pattern: "@package-json", group: "parent" },
          { pattern: "@src/**", group: "parent" },
          { pattern: "@app/**", group: "parent", position: "after" },
          { pattern: "@server/**", group: "parent", position: "after" },
          { pattern: "@modules/**", group: "parent", position: "after" },
          { pattern: "@shared/**", group: "parent", position: "after" },
          { pattern: "@configs/**", group: "parent", position: "after" },
        ],
        "newlines-between": "always",
      },
    ],
  },
} as const;

export { ESLINT_IMPORT_FLAT_CONFIG };