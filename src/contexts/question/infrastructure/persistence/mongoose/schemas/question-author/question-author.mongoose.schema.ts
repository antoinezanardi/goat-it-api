import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

import { DEFAULT_MONGOOSE_SCHEMA_OPTIONS } from "@shared/infrastructure/persistence/mongoose/mongoose.constants";

import { QUESTION_AUTHOR_ROLES } from "@question/domain/value-objects/question-author/question-author.constants";

import { QuestionAuthorRole } from "@question/domain/value-objects/question-author/question-author.types";

@Schema({
  ...DEFAULT_MONGOOSE_SCHEMA_OPTIONS,
})
class QuestionAuthorMongooseSchema {
  @Prop({
    required: true,
    type: String,
    enum: QUESTION_AUTHOR_ROLES,
  })
  public role!: QuestionAuthorRole;

  @Prop({
    required: false,
    type: Types.ObjectId,
  })
  public gameId?: Types.ObjectId;

  @Prop({
    required: false,
    type: String,
  })
  public name?: string;
}

const QUESTION_AUTHOR_MONGOOSE_SCHEMA = SchemaFactory.createForClass(QuestionAuthorMongooseSchema);

export {
  QuestionAuthorMongooseSchema,
  QUESTION_AUTHOR_MONGOOSE_SCHEMA,
};