import packageJson from "@package-json" with { type: "json" };

import { readPackageJson } from "@shared/domain/helpers/package-json/package-json.helpers";

describe(readPackageJson, () => {
  it("should return package metadata from package.json when called.", () => {
    const actualPackageJson = readPackageJson();

    expect(actualPackageJson).toStrictEqual(packageJson);
  });
});