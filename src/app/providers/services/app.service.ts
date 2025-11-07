import { Injectable } from "@nestjs/common";

import packageJson from "@package-json" with { type: "json" };

import type { AppMetadata } from "@app/types/app.types";

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