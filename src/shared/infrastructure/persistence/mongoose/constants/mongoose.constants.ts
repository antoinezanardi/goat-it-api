import type { SchemaOptions } from "@nestjs/mongoose";

const DEFAULT_MONGOOSE_SCHEMA_OPTIONS: Partial<SchemaOptions> = {
  timestamps: true,
  versionKey: false,
  _id: true,
  id: true,
} as const;

const DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS: Partial<SchemaOptions> = {
  ...DEFAULT_MONGOOSE_SCHEMA_OPTIONS,
  timestamps: false,
  _id: false,
  id: false,
} as const;

const MONGO_DUPLICATE_KEY_ERROR_CODE = 11_000;

export {
  DEFAULT_MONGOOSE_SCHEMA_OPTIONS,
  DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS,
  MONGO_DUPLICATE_KEY_ERROR_CODE,
};