import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { QuestionThemeModule } from "@question-theme/question-theme.module";

import { ArchiveQuestionUseCase } from "@question/application/use-cases/archive-question/archive-question.use-case";
import { ModifyQuestionUseCase } from "@question/application/use-cases/modify-question/modify-question.use-case";
import { CreateQuestionUseCase } from "@question/application/use-cases/create-question/create-question.use-case";
import { FindRandomQuestionsUseCase } from "@question/application/use-cases/find-random-questions/find-random-questions.use-case";
import { FindQuestionsUseCase } from "@question/application/use-cases/find-questions/find-questions.use-case";
import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { AssignThemeToQuestionUseCase } from "@question/application/use-cases/question-theme-assignment/assign-theme-to-question/assign-theme-to-question.use-case";
import { ModifyQuestionThemeAssignmentUseCase } from "@question/application/use-cases/question-theme-assignment/modify-question-theme-assignment/modify-question-theme-assignment.use-case";
import { RemoveThemeFromQuestionUseCase } from "@question/application/use-cases/question-theme-assignment/remove-theme-from-question/remove-theme-from-question.use-case";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { AdminQuestionController } from "@question/infrastructure/http/controllers/admin-question/admin-question.controller";
import { QuestionController } from "@question/infrastructure/http/controllers/question/question.controller";
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
    QuestionThemeModule,
  ],
  controllers: [
    QuestionController,
    AdminQuestionController,
  ],
  providers: [
    FindRandomQuestionsUseCase,
    FindQuestionsUseCase,
    FindQuestionByIdUseCase,
    CreateQuestionUseCase,
    ArchiveQuestionUseCase,
    ModifyQuestionUseCase,
    AssignThemeToQuestionUseCase,
    RemoveThemeFromQuestionUseCase,
    ModifyQuestionThemeAssignmentUseCase,
    {
      provide: QUESTION_REPOSITORY_TOKEN,
      useClass: QuestionMongooseRepository,
    },
  ],
})
export class QuestionModule {}