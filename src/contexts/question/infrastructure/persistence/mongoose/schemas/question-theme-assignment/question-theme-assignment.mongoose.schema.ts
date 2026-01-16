import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

import { DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS } from "@shared/infrastructure/persistence/mongoose/mongoose.constants";

import { QUESTION_THEME_MONGOOSE_COLLECTION_NAME } from "@question/modules/question-theme/infrastructure/persistence/mongoose/constants/question-theme.mongoose.constants";

@Schema({
  ...DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS,
})
class QuestionThemeAssignmentMongooseSchema {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: QUESTION_THEME_MONGOOSE_COLLECTION_NAME,
    index: true,
  })
  public themeId!: Types.ObjectId;

  @Prop({
    required: true,
    type: Boolean,
    default: false,
  })
  public isPrimary!: boolean;

  @Prop({
    required: true,
    type: Boolean,
    default: false,
  })
  public isHint!: boolean;
}

const QUESTION_THEME_ASSIGNMENT_MONGOOSE_SCHEMA = SchemaFactory.createForClass(QuestionThemeAssignmentMongooseSchema);

export {
  QuestionThemeAssignmentMongooseSchema,
  QUESTION_THEME_ASSIGNMENT_MONGOOSE_SCHEMA,
};