import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ArchiveQuestionThemeUseCase } from "@question/modules/question-theme/application/use-cases/archive-question-theme/archive-question-theme.use-case";
import { CreateQuestionThemeUseCase } from "@question/modules/question-theme/application/use-cases/create-question-theme/create-question-theme.use-case";
import { FindAllQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-all-question-themes/find-all-question-themes.use-case";
import { FindQuestionThemeByIdUseCase } from "@question/modules/question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { ModifyQuestionThemeUseCase } from "@question/modules/question-theme/application/use-cases/update-question-theme/modify-question-theme.use-case.service";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";
import { AdminQuestionThemeController } from "@question/modules/question-theme/infrastructure/http/controllers/admin-question-theme/admin-question-theme.controller";
import { QuestionThemeController } from "@question/modules/question-theme/infrastructure/http/controllers/question-theme/question-theme.controller";
import { QuestionThemeMongooseRepository } from "@question/modules/question-theme/infrastructure/persistence/mongoose/repository/question-theme.mongoose.repository";
import { QUESTION_THEME_MONGOOSE_SCHEMA, QuestionThemeMongooseSchema } from "@question/modules/question-theme/infrastructure/persistence/mongoose/schema/question-theme.mongoose.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuestionThemeMongooseSchema.name,
        schema: QUESTION_THEME_MONGOOSE_SCHEMA,
      },
    ]),
  ],
  controllers: [
    QuestionThemeController,
    AdminQuestionThemeController,
  ],
  providers: [
    FindAllQuestionThemesUseCase,
    FindQuestionThemeByIdUseCase,
    CreateQuestionThemeUseCase,
    ModifyQuestionThemeUseCase,
    ArchiveQuestionThemeUseCase,
    {
      provide: QUESTION_THEME_REPOSITORY_TOKEN,
      useClass: QuestionThemeMongooseRepository,
    },
  ],
})
export class QuestionThemeModule {}