import { createZodDto } from "nestjs-zod";

import { ADMIN_QUESTION_THEME_ASSIGNMENT_DTO } from "@question/application/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto.shape";

class AdminQuestionThemeAssignmentNestZodDto extends createZodDto(ADMIN_QUESTION_THEME_ASSIGNMENT_DTO) {}

export { AdminQuestionThemeAssignmentNestZodDto };