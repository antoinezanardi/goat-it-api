import { z } from "zod";

import { ADMIN_QUESTION_THEME_DTO } from "@question-theme/application/dto/admin-question-theme/admin-question-theme.dto.shape";

import {
  zQuestionThemeAssignmentIsPrimary,
  zQuestionThemeAssignmentIsHint,
} from "@question/application/dto/shared/zod/validators/question-theme-assignment/question-theme-assignment.dto.zod.validators";

const ADMIN_QUESTION_THEME_ASSIGNMENT_DTO = z.strictObject({
  theme: ADMIN_QUESTION_THEME_DTO
    .describe("Question assigned theme"),
  isPrimary: zQuestionThemeAssignmentIsPrimary(),
  isHint: zQuestionThemeAssignmentIsHint(),
}).describe("Question's theme assignment");

export type AdminQuestionThemeAssignmentDto = z.infer<typeof ADMIN_QUESTION_THEME_ASSIGNMENT_DTO>;

export { ADMIN_QUESTION_THEME_ASSIGNMENT_DTO };