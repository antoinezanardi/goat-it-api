import { createZodDto } from "nestjs-zod";

import { QUESTION_THEME_ASSIGNMENT_DTO } from "@question/application/dto/question/question-theme-assignment/question-theme-assignment.schema";

class QuestionThemeAssignmentDto extends createZodDto(QUESTION_THEME_ASSIGNMENT_DTO) {}

export { QuestionThemeAssignmentDto };