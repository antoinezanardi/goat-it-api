import { Injectable } from "@nestjs/common";

import { readPackageJson } from "@shared/domain/helpers/package-json/package-json.helpers";

import type { AppMetadata } from "@app/types/app.types";

const packageJson = readPackageJson();

@Injectable()
export class AppService {
  public getApiMeta(): AppMetadata {
    void this;

    return {
      packageName: packageJson.name,
      name: "Goat It API",
      description: packageJson.description,
      version: packageJson.version,
    };
  }
}