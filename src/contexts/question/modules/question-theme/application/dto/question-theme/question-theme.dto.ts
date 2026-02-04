import { createZodDto } from "nestjs-zod";

import { QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto.shape";

class QuestionThemeNestZodDto extends createZodDto(QUESTION_THEME_DTO) {}

export { QuestionThemeNestZodDto };