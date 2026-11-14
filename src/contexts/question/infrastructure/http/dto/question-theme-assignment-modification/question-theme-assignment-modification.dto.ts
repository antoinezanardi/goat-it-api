import { createZodDto } from "nestjs-zod";

import { QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO } from "@question/application/dto/question-theme-assignment-modification/question-theme-assignment-modification.dto.shape";

class QuestionThemeAssignmentModificationNestZodDto extends createZodDto(QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO) {}

export { QuestionThemeAssignmentModificationNestZodDto };