import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import { DEFAULT_MONGOOSE_SCHEMA_OPTIONS } from "@shared/infrastructure/persistence/mongoose/mongoose.constants";

import { QUESTION_REJECTION_TYPES } from "@question/domain/value-objects/question-rejection/question-rejection.constants";

import { QuestionRejectionType } from "@question/domain/value-objects/question-rejection/question-rejection.types";

@Schema({
  ...DEFAULT_MONGOOSE_SCHEMA_OPTIONS,
})
class QuestionRejectionMongooseSchema {
  @Prop({
    required: true,
    type: String,
    enum: QUESTION_REJECTION_TYPES,
  })
  public type!: QuestionRejectionType;

  @Prop({
    required: false,
    type: String,
  })
  public comment?: string;
}

const QUESTION_REJECTION_MONGOOSE_SCHEMA = SchemaFactory.createForClass(QuestionRejectionMongooseSchema);

export {
  QuestionRejectionMongooseSchema,
  QUESTION_REJECTION_MONGOOSE_SCHEMA,
};