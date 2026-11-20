import { z } from "zod";

import { ADMIN_QUESTION_THEME_DTO } from "@question-theme/contracts/dto/admin-question-theme/admin-question-theme.dto.shape";

import {
  zQuestionThemeAssignmentIsPrimary,
  zQuestionThemeAssignmentIsHint,
} from "@question/application/dto/zod/validators/question-theme-assignment/question-theme-assignment.dto.zod.validators";

/**
 * Validates one admin theme assignment: a localized theme plus its primary and hint flags.
 */
const ADMIN_QUESTION_THEME_ASSIGNMENT_DTO = z.strictObject({
  theme: ADMIN_QUESTION_THEME_DTO
    .describe("Question assigned theme"),
  isPrimary: zQuestionThemeAssignmentIsPrimary(),
  isHint: zQuestionThemeAssignmentIsHint(),
}).describe("Question's theme assignment");

/**
 * The admin theme assignment consumers receive, with the nested theme left as localized maps.
 */
export type AdminQuestionThemeAssignmentDto = z.infer<typeof ADMIN_QUESTION_THEME_ASSIGNMENT_DTO>;

export { ADMIN_QUESTION_THEME_ASSIGNMENT_DTO };