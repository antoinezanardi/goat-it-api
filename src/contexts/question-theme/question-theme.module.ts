import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ArchiveQuestionThemeUseCase } from "@question-theme/application/use-cases/archive-question-theme/archive-question-theme.use-case";
import { GetQuestionThemeStatsUseCase } from "@question-theme/application/use-cases/get-question-theme-stats/get-question-theme-stats.use-case";
import { CreateQuestionThemeUseCase } from "@question-theme/application/use-cases/create-question-theme/create-question-theme.use-case";
import { FindQuestionThemesUseCase } from "@question-theme/application/use-cases/find-question-themes/find-question-themes.use-case";
import { GetQuestionThemesByIdsOrThrowUseCase } from "@question-theme/application/use-cases/get-question-themes-by-ids-or-throw/get-question-themes-by-ids-or-throw.use-case";
import { FindQuestionThemeByIdUseCase } from "@question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { ModifyQuestionThemeUseCase } from "@question-theme/application/use-cases/modify-question-theme/modify-question-theme.use-case";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question-theme/domain/repositories/question-theme.repository.constants";
import { AdminQuestionThemeController } from "@question-theme/infrastructure/http/controllers/admin-question-theme/admin-question-theme.controller";
import { QuestionThemeController } from "@question-theme/infrastructure/http/controllers/question-theme/question-theme.controller";
import { QuestionThemeMongooseRepository } from "@question-theme/infrastructure/persistence/mongoose/repository/question-theme.mongoose.repository";
import { QUESTION_THEME_MONGOOSE_SCHEMA, QuestionThemeMongooseSchema } from "@question-theme/infrastructure/persistence/mongoose/schema/question-theme.mongoose.schema";

import { QUESTION_MONGOOSE_SCHEMA, QuestionMongooseSchema } from "@question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema";
import { QuestionMongooseRepository } from "@question/infrastructure/persistence/mongoose/repository/question.mongoose.repository";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuestionThemeMongooseSchema.name,
        schema: QUESTION_THEME_MONGOOSE_SCHEMA,
      },
      {
        name: QuestionMongooseSchema.name,
        schema: QUESTION_MONGOOSE_SCHEMA,
      },
    ]),
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
    {
      provide: QUESTION_THEME_REPOSITORY_TOKEN,
      useClass: QuestionThemeMongooseRepository,
    },
    {
      provide: QUESTION_REPOSITORY_TOKEN,
      useClass: QuestionMongooseRepository,
    },
  ],
  exports: [
    FindQuestionThemeByIdUseCase,
    GetQuestionThemesByIdsOrThrowUseCase,
  ],
})
export class QuestionThemeModule {}