import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { QUESTION_THEME_DTO } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";

const QUESTION_THEME_ASSIGNMENT_DTO = z.strictObject({
  theme: QUESTION_THEME_DTO
    .describe("Question assigned theme"),
  isPrimary: z.boolean()
    .describe("Indicates if the assigned theme is the primary theme for the question"),
  isHint: z.boolean()
    .describe("Indicates if the assigned theme is a hint for the question's answer"),
}).describe("Question's theme assignment");

class QuestionThemeAssignmentDto extends createZodDto(QUESTION_THEME_ASSIGNMENT_DTO) {}

export {
  QUESTION_THEME_ASSIGNMENT_DTO,
  QuestionThemeAssignmentDto,
};