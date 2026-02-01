import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS } from "@shared/infrastructure/persistence/mongoose/constants/mongoose.constants";

@Schema({
  ...DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS,
})
class LocalizedTextsMongooseSchema {
  @Prop({
    required: false,
    type: [String],
    default: undefined,
  })
  public en?: string[];

  @Prop({
    required: false,
    type: [String],
    default: undefined,
  })
  public fr?: string[];

  @Prop({
    required: false,
    type: [String],
    default: undefined,
  })
  public es?: string[];

  @Prop({
    required: false,
    type: [String],
    default: undefined,
  })
  public de?: string[];

  @Prop({
    required: false,
    type: [String],
    default: undefined,
  })
  public it?: string[];

  @Prop({
    required: false,
    type: [String],
    default: undefined,
  })
  public pt?: string[];
}

const LOCALIZED_TEXTS_MONGOOSE_SCHEMA = SchemaFactory.createForClass(LocalizedTextsMongooseSchema);

export {
  LocalizedTextsMongooseSchema,
  LOCALIZED_TEXTS_MONGOOSE_SCHEMA,
};