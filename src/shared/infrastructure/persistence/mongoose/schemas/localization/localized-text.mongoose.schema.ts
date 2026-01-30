import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS } from "@shared/infrastructure/persistence/mongoose/constants/mongoose.constants";

@Schema({
  ...DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS,
})
class LocalizedTextMongooseSchema {
  @Prop({
    required: false,
    type: String,
  })
  public en?: string;

  @Prop({
    required: false,
    type: String,
  })
  public fr?: string;

  @Prop({
    required: false,
    type: String,
  })
  public es?: string;

  @Prop({
    required: false,
    type: String,
  })
  public de?: string;

  @Prop({
    required: false,
    type: String,
  })
  public it?: string;

  @Prop({
    required: false,
    type: String,
  })
  public pt?: string;
}

const LOCALIZED_TEXT_MONGOOSE_SCHEMA = SchemaFactory.createForClass(LocalizedTextMongooseSchema);

export {
  LocalizedTextMongooseSchema,
  LOCALIZED_TEXT_MONGOOSE_SCHEMA,
};