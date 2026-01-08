import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { DEFAULT_MONGOOSE_SCHEMA_OPTIONS } from "@shared/infrastructure/persistence/mongoose/mongoose.constants";

import { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

@Schema({
  ...DEFAULT_MONGOOSE_SCHEMA_OPTIONS,
})
class QuestionContentMongooseSchema {
  @Prop({
    required: true,
    type: Object,
  })
  public statement!: LocalizedText;

  @Prop({
    required: true,
    type: Object,
  })
  public answer!: LocalizedText;

  @Prop({
    required: false,
    type: Object,
  })
  public context?: LocalizedText;

  @Prop({
    required: false,
    type: Object,
  })
  public trivia?: LocalizedTexts;
}

const QUESTION_CONTENT_MONGOOSE_SCHEMA = SchemaFactory.createForClass(QuestionContentMongooseSchema);

export {
  QuestionContentMongooseSchema,
  QUESTION_CONTENT_MONGOOSE_SCHEMA,
};