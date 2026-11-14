import { Injectable } from "@nestjs/common";

import type { AppMetadataDto } from "@app/dto/app-metadata/app-metadata.dto.shape";

import { readPackageJson } from "@shared/infrastructure/helpers/package-json/package-json.helpers";

/**
 * Application shell service that exposes the API metadata read from `package.json`.
 */
@Injectable()
export class AppService {
  private readonly packageJson = readPackageJson();

  /**
   * Returns the metadata served by the root endpoint, read once at construction so later changes to `package.json` are not reflected.
   */
  public getApiMeta(): AppMetadataDto {
    return {
      packageName: this.packageJson.name,
      name: "Goat It API",
      description: this.packageJson.description,
      version: this.packageJson.version,
    };
  }
}