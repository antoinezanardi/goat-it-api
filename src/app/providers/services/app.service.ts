import { Injectable } from "@nestjs/common";

import type { AppMetadataDto } from "@app/dto/app-metadata/app-metadata.dto.shape";

import { readPackageJson } from "@shared/infrastructure/helpers/package-json/package-json.helpers";

@Injectable()
export class AppService {
  private readonly packageJson = readPackageJson();

  public getApiMeta(): AppMetadataDto {
    return {
      packageName: this.packageJson.name,
      name: "Goat It API",
      description: this.packageJson.description,
      version: this.packageJson.version,
    };
  }
}