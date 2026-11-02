import { Module } from "@nestjs/common";

import { ArchiveQuestionThemeUseCase } from "@question-theme/application/use-cases/archive-question-theme/archive-question-theme.use-case";
import { GetQuestionThemeStatsUseCase } from "@question-theme/application/use-cases/get-question-theme-stats/get-question-theme-stats.use-case";
import { CreateQuestionThemeUseCase } from "@question-theme/application/use-cases/create-question-theme/create-question-theme.use-case";
import { FindQuestionThemesUseCase } from "@question-theme/application/use-cases/find-question-themes/find-question-themes.use-case";
import { GetQuestionThemesByIdsOrThrowUseCase } from "@question-theme/application/use-cases/get-question-themes-by-ids-or-throw/get-question-themes-by-ids-or-throw.use-case";
import { FindQuestionThemeByIdUseCase } from "@question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { ModifyQuestionThemeUseCase } from "@question-theme/application/use-cases/modify-question-theme/modify-question-theme.use-case";
import { AdminQuestionThemeController } from "@question-theme/infrastructure/http/controllers/admin-question-theme/admin-question-theme.controller";
import { QuestionThemeController } from "@question-theme/infrastructure/http/controllers/question-theme/question-theme.controller";
import { QuestionThemePersistenceModule } from "@question-theme/infrastructure/persistence/question-theme-persistence.module";

import { QuestionUsageModule } from "@question/question-usage.module";

@Module({
  imports: [
    QuestionThemePersistenceModule,
    QuestionUsageModule,
  ],
  controllers: [
    QuestionThemeController,
    AdminQuestionThemeController,
  ],
  providers: [
    FindQuestionThemesUseCase,
    GetQuestionThemesByIdsOrThrowUseCase,
    FindQuestionThemeByIdUseCase,
    CreateQuestionThemeUseCase,
    ModifyQuestionThemeUseCase,
    GetQuestionThemeStatsUseCase,
    ArchiveQuestionThemeUseCase,
  ],
  exports: [
    FindQuestionThemeByIdUseCase,
    GetQuestionThemesByIdsOrThrowUseCase,
  ],
})
export class QuestionThemeModule {}