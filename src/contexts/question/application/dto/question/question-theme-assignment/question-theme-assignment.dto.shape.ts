import { z } from "zod";

import { QUESTION_THEME_DTO } from "@question-theme/contracts/dto/question-theme/question-theme.dto.shape";

import {
  zQuestionThemeAssignmentIsPrimary,
  zQuestionThemeAssignmentIsHint,
} from "@question/application/dto/zod/validators/question-theme-assignment/question-theme-assignment.dto.zod.validators";

/**
 * Validates one public theme assignment: a locale-resolved theme plus its primary and hint flags.
 */
const QUESTION_THEME_ASSIGNMENT_DTO = z.strictObject({
  theme: QUESTION_THEME_DTO
    .describe("Question assigned theme"),
  isPrimary: zQuestionThemeAssignmentIsPrimary(),
  isHint: zQuestionThemeAssignmentIsHint(),
}).describe("Question's theme assignment");

/**
 * The public theme assignment consumers receive, with the theme already resolved for the request locale.
 */
export type QuestionThemeAssignmentDto = z.infer<typeof QUESTION_THEME_ASSIGNMENT_DTO>;

export { QUESTION_THEME_ASSIGNMENT_DTO };