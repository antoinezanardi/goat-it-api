import type { APP_METADATA_DTO } from "@app/dto/app-metadata/app-metadata.dto";

import type { z } from "zod";

type AppMetadata = z.infer<typeof APP_METADATA_DTO>;

export type {
  AppMetadata,
};