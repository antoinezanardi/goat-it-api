import { createZodDto } from "nestjs-zod";

import { QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/question-theme/question-theme.schema";

class QuestionThemeDto extends createZodDto(QUESTION_THEME_DTO) {}

export { QuestionThemeDto };