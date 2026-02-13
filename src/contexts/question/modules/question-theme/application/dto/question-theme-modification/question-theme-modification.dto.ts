import { createZodDto } from "nestjs-zod";

import { QUESTION_THEME_MODIFICATION_DTO } from "@question/modules/question-theme/application/dto/question-theme-modification/question-theme-modification.dto.shape";

class QuestionThemeModificationNestZodDto extends createZodDto(QUESTION_THEME_MODIFICATION_DTO) {}

export { QuestionThemeModificationNestZodDto };