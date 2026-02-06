import { createZodDto } from "nestjs-zod";

import { ADMIN_QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto.shape";

class AdminQuestionThemeNestZodDto extends createZodDto(ADMIN_QUESTION_THEME_DTO) {}

export { AdminQuestionThemeNestZodDto };