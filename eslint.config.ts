import oxlint from "eslint-plugin-oxlint";

import { ESLINT_UNIT_TESTS_MOCKS_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-unit-tests-mocks.flat-config";
import { ESLINT_IGNORES } from "./configs/eslint/eslint.constants";
import { ESLINT_CONFIG_FILES_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-config-files.flat-config";
import { ESLINT_CONTROLLERS_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-controllers.flat-config";
import { ESLINT_GLOBAL_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-global.flat-config";
import { ESLINT_IMPORT_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-import.flat-config";
import { ESLINT_MODULES_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-modules.flat-config";
import { ESLINT_SERVICES_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-services.flat-config";
import { ESLINT_STYLISTIC_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-stylistic.flat-config";
import { ESLINT_UNICORN_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-unicorn.flat-config";
import { ESLINT_UNIT_TESTS_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-unit-tests.flat-config";
import { ESLINT_TYPESCRIPT_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-typescript.flat-config";
import { ESLINT_TYPESCRIPT_DECLARATION_CONFIG } from "./configs/eslint/flat-configs/eslint.typescript-declaration-config";
import { ESLINT_CUCUMBER_STEPS_AND_HOOKS_FLAT_CONFIG } from "./configs/eslint/flat-configs/eslint-cucumber-steps-and-hooks.flat-config";

import type { Linter } from "eslint";

const ESLINT_FLAT_CONFIGS: Linter.Config[] = [
  {
    name: "global-ignores",
    ignores: ESLINT_IGNORES,
  },
  ESLINT_GLOBAL_FLAT_CONFIG,
  ESLINT_UNICORN_FLAT_CONFIG,
  ESLINT_IMPORT_FLAT_CONFIG,
  ESLINT_TYPESCRIPT_FLAT_CONFIG,
  ESLINT_STYLISTIC_FLAT_CONFIG,
  ESLINT_CONFIG_FILES_FLAT_CONFIG,
  ESLINT_UNIT_TESTS_FLAT_CONFIG,
  ESLINT_MODULES_FLAT_CONFIG,
  ESLINT_CONTROLLERS_FLAT_CONFIG,
  ESLINT_SERVICES_FLAT_CONFIG,
  ESLINT_TYPESCRIPT_DECLARATION_CONFIG,
  ESLINT_CUCUMBER_STEPS_AND_HOOKS_FLAT_CONFIG,
  ESLINT_UNIT_TESTS_MOCKS_FLAT_CONFIG,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  ...oxlint.buildFromOxlintConfigFile("./configs/oxlint/oxlint.config.jsonc") as Linter.Config[],
];

export default ESLINT_FLAT_CONFIGS;