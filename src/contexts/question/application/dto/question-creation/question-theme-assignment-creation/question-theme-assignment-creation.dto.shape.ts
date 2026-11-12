import { z } from "zod";

import { zMongoId } from "@shared/application/dto/zod/validators/string/string.zod.validators";

import {
  zQuestionThemeAssignmentIsPrimary,
  zQuestionThemeAssignmentIsHint,
} from "@question/application/dto/zod/validators/question-theme-assignment/question-theme-assignment.dto.zod.validators";

/**
 * Validates one theme to assign on creation: a Mongo theme id plus its primary and hint flags.
 */
const QUESTION_THEME_ASSIGNMENT_CREATION_DTO = z.object({
  themeId: zMongoId()
    .describe("The ID of the theme to assign to the question"),
  isPrimary: zQuestionThemeAssignmentIsPrimary(),
  isHint: zQuestionThemeAssignmentIsHint(),
});

/**
 * The validated theme assignment consumers receive before it is reduced to a repository contract.
 */
export type QuestionThemeAssignmentCreationDto = z.infer<typeof QUESTION_THEME_ASSIGNMENT_CREATION_DTO>;

export { QUESTION_THEME_ASSIGNMENT_CREATION_DTO };