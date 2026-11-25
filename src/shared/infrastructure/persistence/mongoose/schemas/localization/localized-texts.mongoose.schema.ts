import { Schema, SchemaFactory } from "@nestjs/mongoose";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";
import { DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS } from "@shared/infrastructure/persistence/mongoose/constants/mongoose.constants";

@Schema({
  ...DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS,
})
class LocalizedTextsMongooseSchema {}

const LOCALIZED_TEXTS_MONGOOSE_SCHEMA = SchemaFactory.createForClass(LocalizedTextsMongooseSchema);

LOCALIZED_TEXTS_MONGOOSE_SCHEMA.add(Object.fromEntries(LOCALES.map(locale => [locale, { required: false, type: [String], default: undefined }])));

export {
  LocalizedTextsMongooseSchema,
  LOCALIZED_TEXTS_MONGOOSE_SCHEMA,
};