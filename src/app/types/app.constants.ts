import { z } from "zod";

import { zSlug } from "@shared/infrastructure/http/validators/zod/string/string.zod.validators";

const APP_METADATA_SCHEMA = z.object({
  name: z.string()
    .min(1)
    .describe("Application's name"),
  version: z.string()
    .min(1)
    .regex(/^\d+\.\d+\.\d+(?:-.+)?$/u)
    .describe("Application's version from package.json"),
  description: z.string()
    .min(1)
    .describe("Application's description from package.json"),
  packageName: zSlug()
    .describe("Application's package name from package.json"),
});

export { APP_METADATA_SCHEMA };