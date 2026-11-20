import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question-theme/domain/repositories/question-theme.repository.constants";
import { QuestionThemeMongooseRepository } from "@question-theme/infrastructure/persistence/mongoose/repository/question-theme.mongoose.repository";
import { QUESTION_THEME_MONGOOSE_SCHEMA, QuestionThemeMongooseSchema } from "@question-theme/infrastructure/persistence/mongoose/schemas/question-theme.mongoose.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: QuestionThemeMongooseSchema.name,
        schema: QUESTION_THEME_MONGOOSE_SCHEMA,
      },
    ]),
  ],
  providers: [
    {
      provide: QUESTION_THEME_REPOSITORY_TOKEN,
      useClass: QuestionThemeMongooseRepository,
    },
  ],
  exports: [QUESTION_THEME_REPOSITORY_TOKEN],
})
export class QuestionThemePersistenceModule {}