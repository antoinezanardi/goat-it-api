import { readFileSync } from "node:fs";
import path from "node:path";

import type { PackageJson } from "@shared/infrastructure/helpers/package-json/package-json.helpers.types";

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