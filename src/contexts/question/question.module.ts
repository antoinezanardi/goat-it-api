import { Module } from "@nestjs/common";

import { QuestionThemeModule } from "@question-theme/question-theme.module";

import { ArchiveQuestionUseCase } from "@question/application/use-cases/archive-question/archive-question.use-case";
import { ModifyQuestionUseCase } from "@question/application/use-cases/modify-question/modify-question.use-case";
import { CreateQuestionUseCase } from "@question/application/use-cases/create-question/create-question.use-case";
import { GetQuestionStatsUseCase } from "@question/application/use-cases/get-question-stats/get-question-stats.use-case";
import { FindRandomQuestionsUseCase } from "@question/application/use-cases/find-random-questions/find-random-questions.use-case";
import { FindQuestionsUseCase } from "@question/application/use-cases/find-questions/find-questions.use-case";
import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { AssignThemeToQuestionUseCase } from "@question/application/use-cases/question-theme-assignment/assign-theme-to-question/assign-theme-to-question.use-case";
import { ModifyQuestionThemeAssignmentUseCase } from "@question/application/use-cases/question-theme-assignment/modify-question-theme-assignment/modify-question-theme-assignment.use-case";
import { RemoveThemeFromQuestionUseCase } from "@question/application/use-cases/question-theme-assignment/remove-theme-from-question/remove-theme-from-question.use-case";
import { AdminQuestionController } from "@question/infrastructure/http/controllers/admin-question/admin-question.controller";
import { QuestionController } from "@question/infrastructure/http/controllers/question/question.controller";
import { QuestionPersistenceModule } from "@question/infrastructure/persistence/question-persistence.module";

@Module({
  imports: [
    QuestionPersistenceModule,
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
    GetQuestionStatsUseCase,
    RemoveThemeFromQuestionUseCase,
    ModifyQuestionThemeAssignmentUseCase,
  ],
})
export class QuestionModule {}