import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

import { DEFAULT_MONGOOSE_SCHEMA_OPTIONS } from "@shared/infrastructure/persistence/mongoose/mongoose.constants";

import { DEFAULT_QUESTION_THEME_STATUS, QUESTION_THEME_STATUSES } from "@question/domain/value-objects/question-theme/question-theme-status.constants";
import { QUESTION_THEME_MONGOOSE_COLLECTION_NAME } from "@question/infrastructure/persistence/mongoose/question-theme/constants/question-theme.mongoose.constants";

import { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";
import { QuestionThemeStatus } from "@question/domain/value-objects/question-theme/question-theme-status.types";

@Schema({
  ...DEFAULT_MONGOOSE_SCHEMA_OPTIONS,
  collection: QUESTION_THEME_MONGOOSE_COLLECTION_NAME,
})
class QuestionThemeMongooseSchema {
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
    required: false,
    type: Types.ObjectId,
    ref: QuestionThemeMongooseSchema.name,
  })
  public parentId?: Types.ObjectId;

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