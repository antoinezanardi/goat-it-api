import { Module } from "@nestjs/common";

import { QuestionThemeModule } from "@question/modules/question-theme/question-theme.module";

@Module({
  imports: [QuestionThemeModule],
})
export class QuestionModule {}