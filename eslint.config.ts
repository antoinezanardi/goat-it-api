import type { Linter } from "eslint";

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

export default [
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
] satisfies Linter.Config[];