import { Schema, SchemaFactory } from "@nestjs/mongoose";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";
import { DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS } from "@shared/infrastructure/persistence/mongoose/constants/mongoose.constants";

@Schema({
  ...DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS,
})
class LocalizedTextMongooseSchema {}

const LOCALIZED_TEXT_MONGOOSE_SCHEMA = SchemaFactory.createForClass(LocalizedTextMongooseSchema);

LOCALIZED_TEXT_MONGOOSE_SCHEMA.add(Object.fromEntries(LOCALES.map(locale => [locale, { required: false, type: String }])));

export {
  LocalizedTextMongooseSchema,
  LOCALIZED_TEXT_MONGOOSE_SCHEMA,
};