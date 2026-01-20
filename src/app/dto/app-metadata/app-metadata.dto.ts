import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { zSlug } from "@shared/infrastructure/http/zod/validators/string/string.zod.validators";

const APP_METADATA_DTO = z.strictObject({
  name: z.string()
    .min(1)
    .describe("Application's name")
    .meta({ example: "Goat It" }),
  version: z.string()
    .min(1)
    .regex(/^\d+\.\d+\.\d+(?:-.+)?$/u)
    .describe("Application's version from package.json")
    .meta({ example: "1.8.0" }),
  description: z.string()
    .min(1)
    .describe("Application's description from package.json")
    .meta({ example: "An AI-powered question and answer platform." }),
  packageName: zSlug()
    .describe("Application's package name from package.json")
    .meta({ example: "goat-it-api" }),
});

class AppMetadataDto extends createZodDto(APP_METADATA_DTO) {}

export {
  APP_METADATA_DTO,
  AppMetadataDto,
};