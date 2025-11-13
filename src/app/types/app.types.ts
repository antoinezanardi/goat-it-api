import { createZodDto } from "nestjs-zod";

import { APP_METADATA_SCHEMA } from "@app/types/app.constants";

import type { z } from "zod";

type AppMetadata = z.infer<typeof APP_METADATA_SCHEMA>;

class GetAppMetadataResponseDto extends createZodDto(APP_METADATA_SCHEMA) {}

export type {
  AppMetadata,
};

export {
  GetAppMetadataResponseDto,
};