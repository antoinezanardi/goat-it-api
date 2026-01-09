import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { DEFAULT_MONGOOSE_SCHEMA_OPTIONS } from "@shared/infrastructure/persistence/mongoose/mongoose.constants";

import { QUESTION_THEME_ASSIGNMENT_MONGOOSE_SCHEMA, QuestionThemeAssignmentMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question-theme-assignment/question-theme-assignment.mongoose.schema";
import { QuestionAuthorMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question-author/question-author.mongoose.schema";
import { QUESTION_CONTENT_MONGOOSE_SCHEMA, QuestionContentMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question-content/question-content.mongoose.schema";
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";
import { QUESTION_MONGOOSE_COLLECTION_NAME } from "@question/infrastructure/persistence/mongoose/constants/question.mongoose.constants";
import { QUESTION_STATUSES } from "@question/domain/value-objects/question-status/question-status.constants";

import { QuestionCognitiveDifficulty } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.types";
import { QuestionStatus } from "@question/domain/value-objects/question-status/question-status.types";

@Schema({
  ...DEFAULT_MONGOOSE_SCHEMA_OPTIONS,
  collection: QUESTION_MONGOOSE_COLLECTION_NAME,
})
class QuestionMongooseSchema {
  @Prop({
    required: true,
    type: [QUESTION_THEME_ASSIGNMENT_MONGOOSE_SCHEMA],
    minItems: 1,
  })
  public themes!: QuestionThemeAssignmentMongooseSchema[];

  @Prop({
    required: true,
    type: QUESTION_CONTENT_MONGOOSE_SCHEMA,
  })
  public content!: QuestionContentMongooseSchema;

  @Prop({
    required: true,
    type: String,
    enum: QUESTION_COGNITIVE_DIFFICULTIES,
  })
  public cognitiveDifficulty!: QuestionCognitiveDifficulty;

  @Prop({
    required: true,
    type: QuestionAuthorMongooseSchema,
  })
  public author!: QuestionAuthorMongooseSchema;

  @Prop({
    required: true,
    type: String,
    enum: QUESTION_STATUSES,
  })
  public status!: QuestionStatus;

  @Prop({
    required: true,
    type: [String],
    minItems: 1,
  })
  public sourceUrls!: string[];

  public createdAt!: Date;

  public updatedAt!: Date;
}

const QUESTION_MONGOOSE_SCHEMA = SchemaFactory.createForClass(QuestionMongooseSchema);

export {
  QuestionMongooseSchema,
  QUESTION_MONGOOSE_SCHEMA,
};