import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { FindAllQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-all-question-themes/find-all-question-themes.use-case";
import { QuestionThemeController } from "@question/modules/question-theme/infrastructure/http/controllers/question-theme.controller";
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
  controllers: [QuestionThemeController],
  providers: [
    FindAllQuestionThemesUseCase,
    {
      provide: "QuestionThemeRepository",
      useClass: QuestionThemeMongooseRepository,
    },
  ],
})
export class QuestionThemeModule {}