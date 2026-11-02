import { Module } from "@nestjs/common";

import { CountLiveQuestionsByThemeIdUseCase } from "@question/application/use-cases/count-live-questions-by-theme-id/count-live-questions-by-theme-id.use-case";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { QuestionPersistenceModule } from "@question/infrastructure/persistence/question-persistence.module";

import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

@Module({
  imports: [QuestionPersistenceModule],
  providers: [
    {
      provide: CountLiveQuestionsByThemeIdUseCase,
      useFactory: (questionRepository: QuestionRepository): CountLiveQuestionsByThemeIdUseCase => new CountLiveQuestionsByThemeIdUseCase(questionRepository),
      inject: [QUESTION_REPOSITORY_TOKEN],
    },
  ],
  exports: [CountLiveQuestionsByThemeIdUseCase],
})
export class QuestionUsageModule {}