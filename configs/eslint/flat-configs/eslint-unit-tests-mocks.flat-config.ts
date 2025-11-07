import type { Linter } from "eslint";

const ESLINT_UNIT_TESTS_MOCKS_FLAT_CONFIG: Linter.Config = {
  name: "unit-tests-mocks",
  files: ["tests/unit/utils/mocks/**/*.mock.ts"],
  rules: {
    "prefer-arrow-callback": "off",
  },
} as const;

export { ESLINT_UNIT_TESTS_MOCKS_FLAT_CONFIG };