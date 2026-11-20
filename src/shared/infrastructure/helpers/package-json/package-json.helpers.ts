import { readFileSync } from "node:fs";
import path from "node:path";

import type { PackageJson } from "@shared/infrastructure/helpers/package-json/package-json.helpers.types";

/**
 * Reads the project `package.json` from the current working directory, so the process must run from the app root.
 *
 * The metadata is trusted and read synchronously once at startup; a missing file or malformed JSON is not recovered and propagates to the caller.
 */
function readPackageJson(): PackageJson {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  // Acceptable as package.json is trusted build metadata that must be read synchronously
  // oxlint-disable-next-line node/no-sync
  const rawPackageJson: unknown = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  // Acceptable as the shape of package.json is owned by this project
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return rawPackageJson as PackageJson;
}

export {
  readPackageJson,
};