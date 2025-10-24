import { Injectable } from "@nestjs/common";

import packageJson from "@package-json" assert { type: "json" };

import { APIMetadata } from "@app/types/app.types";

@Injectable()
export class AppService {
  public getApiMeta(): APIMetadata {
    void this;

    return {
      name: "Goat It API",
      description: packageJson.description,
      version: packageJson.version,
    };
  }
}