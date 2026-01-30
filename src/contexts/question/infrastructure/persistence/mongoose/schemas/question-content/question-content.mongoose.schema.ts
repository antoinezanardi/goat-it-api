import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS } from "@shared/infrastructure/persistence/mongoose/constants/mongoose.constants";
import { LOCALIZED_TEXT_MONGOOSE_SCHEMA } from "@shared/infrastructure/persistence/mongoose/schemas/localization/localized-text.mongoose.schema";
import { LOCALIZED_TEXTS_MONGOOSE_SCHEMA } from "@shared/infrastructure/persistence/mongoose/schemas/localization/localized-texts.mongoose.schema";

import { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

@Schema({
  ...DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS,
})
class QuestionContentMongooseSchema {
  @Prop({
    required: true,
    type: LOCALIZED_TEXT_MONGOOSE_SCHEMA,
  })
  public statement!: Partial<LocalizedText>;

  @Prop({
    required: true,
    type: LOCALIZED_TEXT_MONGOOSE_SCHEMA,
  })
  public answer!: Partial<LocalizedText>;

  @Prop({
    required: false,
    type: LOCALIZED_TEXT_MONGOOSE_SCHEMA,
  })
  public context?: Partial<LocalizedText>;

  @Prop({
    required: false,
    type: LOCALIZED_TEXTS_MONGOOSE_SCHEMA,
  })
  public trivia?: Partial<LocalizedTexts>;
}

const QUESTION_CONTENT_MONGOOSE_SCHEMA = SchemaFactory.createForClass(QuestionContentMongooseSchema);

export {
  QuestionContentMongooseSchema,
  QUESTION_CONTENT_MONGOOSE_SCHEMA,
};