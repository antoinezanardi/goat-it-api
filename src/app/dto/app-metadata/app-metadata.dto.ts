import { createZodDto } from "nestjs-zod";

import { APP_METADATA_DTO } from "@app/dto/app-metadata/app-metadata.schema";

class AppMetadataDto extends createZodDto(APP_METADATA_DTO) {}

export { AppMetadataDto };