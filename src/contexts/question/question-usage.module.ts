import { Module } from "@nestjs/common";

import { createUseCaseProvider } from "@shared/infrastructure/nest/helpers/use-case-provider.helpers";

import { CountLiveQuestionsByThemeIdUseCase } from "@question/application/use-cases/count-live-questions-by-theme-id/count-live-questions-by-theme-id.use-case";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { QuestionPersistenceModule } from "@question/infrastructure/persistence/question-persistence.module";

@Module({
  imports: [QuestionPersistenceModule],
  providers: [createUseCaseProvider(CountLiveQuestionsByThemeIdUseCase, [QUESTION_REPOSITORY_TOKEN])],
  exports: [CountLiveQuestionsByThemeIdUseCase],
})
export class QuestionUsageModule {}