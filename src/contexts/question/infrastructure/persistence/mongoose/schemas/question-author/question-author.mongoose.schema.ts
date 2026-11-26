import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

import { DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS } from "@shared/infrastructure/persistence/mongoose/constants/mongoose.constants";

import { QUESTION_AUTHOR_ROLE_GAME, QUESTION_AUTHOR_ROLES } from "@question/domain/constants/question.constants";

import type { QuestionAuthorRole } from "@question/domain/types/question.value-objects";

@Schema({
  ...DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS,
})
class QuestionAuthorMongooseSchema {
  @Prop({
    required: true,
    type: String,
    enum: QUESTION_AUTHOR_ROLES,
  })
  public role!: QuestionAuthorRole;

  @Prop({
    required(this: QuestionAuthorMongooseSchema): boolean {
      return this.role === QUESTION_AUTHOR_ROLE_GAME;
    },
    validate: {
      validator(this: QuestionAuthorMongooseSchema, gameId: Types.ObjectId | undefined): boolean {
        return this.role === QUESTION_AUTHOR_ROLE_GAME || gameId === undefined;
      },
      message: "gameId is only allowed when the author role is 'game'",
    },
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