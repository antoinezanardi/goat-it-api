import { createZodDto } from "nestjs-zod";

import { QUESTION_THEME_CREATION_DTO } from "@question/modules/question-theme/application/dto/question-theme-creation/question-theme-creation.schema";

class QuestionThemeCreationDto extends createZodDto(QUESTION_THEME_CREATION_DTO) {}

export { QuestionThemeCreationDto };