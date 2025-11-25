import type { SchemaOptions } from "@nestjs/mongoose";

const DEFAULT_MONGOOSE_SCHEMA_OPTIONS: Partial<SchemaOptions> = {
  timestamps: true,
  versionKey: false,
  _id: true,
  id: true,
} as const;

export { DEFAULT_MONGOOSE_SCHEMA_OPTIONS };