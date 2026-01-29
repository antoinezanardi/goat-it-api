import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ArchiveQuestionUseCase } from "@question/application/use-cases/archive-question/archive-question.use-case";
import { CreateQuestionUseCase } from "@question/application/use-cases/create-question/create-question.use-case";
import { FindQuestionsUseCase } from "@question/application/use-cases/find-questions/find-questions.use-case";
import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { AdminQuestionController } from "@question/infrastructure/http/controllers/admin-question/admin-question.controller";
import { QuestionController } from "@question/infrastructure/http/controllers/question/question.controller";
import { QuestionMongooseRepository } from "@question/infrastructure/persistence/mongoose/repository/question.mongoose.repository";
import { QUESTION_MONGOOSE_SCHEMA, QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";
import { QuestionThemeModule } from "@question/modules/question-theme/question-theme.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuestionMongooseSchema.name,
        schema: QUESTION_MONGOOSE_SCHEMA,
      },
    ]),
    QuestionThemeModule,
  ],
  controllers: [
    QuestionController,
    AdminQuestionController,
  ],
  providers: [
    FindQuestionsUseCase,
    FindQuestionByIdUseCase,
    CreateQuestionUseCase,
    ArchiveQuestionUseCase,
    {
      provide: QUESTION_REPOSITORY_TOKEN,
      useClass: QuestionMongooseRepository,
    },
  ],
})
export class QuestionModule {}