import { createZodDto } from "nestjs-zod";

import { APP_METADATA_DTO } from "@app/dto/app-metadata/app-metadata.dto.shape";

class AppMetadataNestZodDto extends createZodDto(APP_METADATA_DTO) {}

export { AppMetadataNestZodDto };