import { createZodDto } from "nestjs-zod";

import { QUESTION_THEME_MODIFICATION_DTO } from "@question/modules/question-theme/application/dto/question-theme-modification/question-theme-modification.schema";

class QuestionThemeModificationDto extends createZodDto(QUESTION_THEME_MODIFICATION_DTO) {}

export { QuestionThemeModificationDto };