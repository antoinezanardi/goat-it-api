import { Module } from "@nestjs/common";

import { FindQuestionThemeByIdUseCase } from "@question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { GetQuestionThemesByIdsOrThrowUseCase } from "@question-theme/application/use-cases/get-question-themes-by-ids-or-throw/get-question-themes-by-ids-or-throw.use-case";
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
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { AdminQuestionController } from "@question/infrastructure/http/controllers/admin-question/admin-question.controller";
import { QuestionController } from "@question/infrastructure/http/controllers/question/question.controller";
import { QuestionPersistenceModule } from "@question/infrastructure/persistence/question-persistence.module";

import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

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
    {
      provide: FindRandomQuestionsUseCase,
      useFactory: (questionRepository: QuestionRepository): FindRandomQuestionsUseCase => new FindRandomQuestionsUseCase(questionRepository),
      inject: [QUESTION_REPOSITORY_TOKEN],
    },
    {
      provide: FindQuestionsUseCase,
      useFactory: (questionRepository: QuestionRepository): FindQuestionsUseCase => new FindQuestionsUseCase(questionRepository),
      inject: [QUESTION_REPOSITORY_TOKEN],
    },
    {
      provide: FindQuestionByIdUseCase,
      useFactory: (questionRepository: QuestionRepository): FindQuestionByIdUseCase => new FindQuestionByIdUseCase(questionRepository),
      inject: [QUESTION_REPOSITORY_TOKEN],
    },
    {
      provide: CreateQuestionUseCase,
      useFactory: (
        questionRepository: QuestionRepository,
        getQuestionThemesByIdsOrThrowUseCase: GetQuestionThemesByIdsOrThrowUseCase,
      ): CreateQuestionUseCase => new CreateQuestionUseCase(questionRepository, getQuestionThemesByIdsOrThrowUseCase),
      inject: [QUESTION_REPOSITORY_TOKEN, GetQuestionThemesByIdsOrThrowUseCase],
    },
    {
      provide: ArchiveQuestionUseCase,
      useFactory: (questionRepository: QuestionRepository): ArchiveQuestionUseCase => new ArchiveQuestionUseCase(questionRepository),
      inject: [QUESTION_REPOSITORY_TOKEN],
    },
    {
      provide: ModifyQuestionUseCase,
      useFactory: (questionRepository: QuestionRepository): ModifyQuestionUseCase => new ModifyQuestionUseCase(questionRepository),
      inject: [QUESTION_REPOSITORY_TOKEN],
    },
    {
      provide: AssignThemeToQuestionUseCase,
      useFactory: (
        questionRepository: QuestionRepository,
        findQuestionThemeByIdUseCase: FindQuestionThemeByIdUseCase,
        findQuestionByIdUseCase: FindQuestionByIdUseCase,
      ): AssignThemeToQuestionUseCase => new AssignThemeToQuestionUseCase(questionRepository, findQuestionThemeByIdUseCase, findQuestionByIdUseCase),
      inject: [QUESTION_REPOSITORY_TOKEN, FindQuestionThemeByIdUseCase, FindQuestionByIdUseCase],
    },
    {
      provide: GetQuestionStatsUseCase,
      useFactory: (questionRepository: QuestionRepository): GetQuestionStatsUseCase => new GetQuestionStatsUseCase(questionRepository),
      inject: [QUESTION_REPOSITORY_TOKEN],
    },
    {
      provide: RemoveThemeFromQuestionUseCase,
      useFactory: (
        questionRepository: QuestionRepository,
        findQuestionByIdUseCase: FindQuestionByIdUseCase,
      ): RemoveThemeFromQuestionUseCase => new RemoveThemeFromQuestionUseCase(questionRepository, findQuestionByIdUseCase),
      inject: [QUESTION_REPOSITORY_TOKEN, FindQuestionByIdUseCase],
    },
    {
      provide: ModifyQuestionThemeAssignmentUseCase,
      useFactory: (
        questionRepository: QuestionRepository,
        findQuestionByIdUseCase: FindQuestionByIdUseCase,
      ): ModifyQuestionThemeAssignmentUseCase => new ModifyQuestionThemeAssignmentUseCase(questionRepository, findQuestionByIdUseCase),
      inject: [QUESTION_REPOSITORY_TOKEN, FindQuestionByIdUseCase],
    },
  ],
})
export class QuestionModule {}