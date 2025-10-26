import { z } from "zod";

const APP_METADATA_SCHEMA = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  packageName: z.string(),
});

export { APP_METADATA_SCHEMA };