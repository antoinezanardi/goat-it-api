import { z } from "zod";

import { zMongoId } from "@shared/infrastructure/http/zod/validators/string/string.zod.validators";

import {
  zQuestionThemeAssignmentIsPrimary,
  zQuestionThemeAssignmentIsHint,
} from "@question/application/dto/shared/zod/validators/question-theme-assignment/question-theme-assignment.dto.zod.validators";

const QUESTION_THEME_ASSIGNMENT_CREATION_DTO = z.object({
  themeId: zMongoId()
    .describe("The ID of the theme to assign to the question"),
  isPrimary: zQuestionThemeAssignmentIsPrimary(),
  isHint: zQuestionThemeAssignmentIsHint(),
});

export type QuestionThemeAssignmentCreationDto = z.infer<typeof QUESTION_THEME_ASSIGNMENT_CREATION_DTO>;

export { QUESTION_THEME_ASSIGNMENT_CREATION_DTO };