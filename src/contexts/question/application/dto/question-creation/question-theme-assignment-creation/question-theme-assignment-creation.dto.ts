import { createZodDto } from "nestjs-zod";

import { QUESTION_THEME_ASSIGNMENT_CREATION_DTO } from "@question/application/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto.shape";

class QuestionThemeAssignmentCreationNestZodDto extends createZodDto(QUESTION_THEME_ASSIGNMENT_CREATION_DTO) {}

export { QuestionThemeAssignmentCreationNestZodDto };