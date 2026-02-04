import { createZodDto } from "nestjs-zod";

import { QUESTION_THEME_ASSIGNMENT_CREATION_DTO } from "@question/application/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.schema";

class QuestionThemeAssignmentCreationDto extends createZodDto(QUESTION_THEME_ASSIGNMENT_CREATION_DTO) {}

export { QuestionThemeAssignmentCreationDto };