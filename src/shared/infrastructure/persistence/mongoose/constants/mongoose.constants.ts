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

export {
  DEFAULT_MONGOOSE_SCHEMA_OPTIONS,
  DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS,
};