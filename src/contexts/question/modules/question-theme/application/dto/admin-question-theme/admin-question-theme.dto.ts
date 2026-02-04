import { createZodDto } from "nestjs-zod";

import { ADMIN_QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.schema";

class AdminQuestionThemeDto extends createZodDto(ADMIN_QUESTION_THEME_DTO) {}

export { AdminQuestionThemeDto };