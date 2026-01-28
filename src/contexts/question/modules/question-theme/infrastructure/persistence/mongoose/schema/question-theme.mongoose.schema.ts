import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { DEFAULT_MONGOOSE_SCHEMA_OPTIONS } from "@shared/infrastructure/persistence/mongoose/constants/mongoose.constants";

import { DEFAULT_QUESTION_THEME_STATUS, QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";
import { QUESTION_THEME_MONGOOSE_COLLECTION_NAME } from "@question/modules/question-theme/infrastructure/persistence/mongoose/constants/question-theme.mongoose.constants";

import { QuestionThemeStatus } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.types";
import { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

@Schema({
  ...DEFAULT_MONGOOSE_SCHEMA_OPTIONS,
  collection: QUESTION_THEME_MONGOOSE_COLLECTION_NAME,
})
class QuestionThemeMongooseSchema {
  @Prop({
    required: true,
    type: String,
    unique: true,
    index: true,
  })
  public slug!: string;

  @Prop({
    required: true,
    type: Object,
  })
  public label!: LocalizedText;

  @Prop({
    required: true,
    type: Object,
  })
  public aliases!: LocalizedTexts;

  @Prop({
    required: true,
    type: Object,
  })
  public description!: LocalizedText;

  @Prop({
    required: true,
    type: String,
    enum: QUESTION_THEME_STATUSES,
    default: DEFAULT_QUESTION_THEME_STATUS,
  })
  public status!: QuestionThemeStatus;

  public createdAt!: Date;

  public updatedAt!: Date;
}

const QUESTION_THEME_MONGOOSE_SCHEMA = SchemaFactory.createForClass(QuestionThemeMongooseSchema);

export {
  QuestionThemeMongooseSchema,
  QUESTION_THEME_MONGOOSE_SCHEMA,
};