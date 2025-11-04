import { z } from "zod";

const APP_METADATA_SCHEMA = z.object({
  name: z.string()
    .nonempty()
    .describe("Application's name"),
  version: z.string()
    .nonempty()
    .regex(/^\d+\.\d+\.\d+(?:-.+)?$/u)
    .describe("Application's version from package.json"),
  description: z.string()
    .nonempty()
    .describe("Application's description from package.json"),
  packageName: z.string()
    .nonempty()
    .describe("Application's package name from package.json"),
});

export { APP_METADATA_SCHEMA };