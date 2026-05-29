import { z } from "zod";

import { QUESTION_THEME_DTO } from "@question-theme/application/dto/question-theme/question-theme.dto.shape";

import {
  zQuestionThemeAssignmentIsPrimary,
  zQuestionThemeAssignmentIsHint,
} from "@question/application/dto/shared/zod/validators/question-theme-assignment/question-theme-assignment.dto.zod.validators";

const QUESTION_THEME_ASSIGNMENT_DTO = z.strictObject({
  theme: QUESTION_THEME_DTO
    .describe("Question assigned theme"),
  isPrimary: zQuestionThemeAssignmentIsPrimary(),
  isHint: zQuestionThemeAssignmentIsHint(),
}).describe("Question's theme assignment");

export type QuestionThemeAssignmentDto = z.infer<typeof QUESTION_THEME_ASSIGNMENT_DTO>;

export { QUESTION_THEME_ASSIGNMENT_DTO };