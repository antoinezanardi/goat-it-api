import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { QuestionMongooseRepository } from "@question/infrastructure/persistence/mongoose/repository/question.mongoose.repository";
import { QUESTION_MONGOOSE_SCHEMA, QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuestionMongooseSchema.name,
        schema: QUESTION_MONGOOSE_SCHEMA,
      },
    ]),
  ],
  providers: [
    {
      provide: QUESTION_REPOSITORY_TOKEN,
      useClass: QuestionMongooseRepository,
    },
  ],
  exports: [QUESTION_REPOSITORY_TOKEN],
})
export class QuestionPersistenceModule {}