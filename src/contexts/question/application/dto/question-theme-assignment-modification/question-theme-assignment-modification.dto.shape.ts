import { z } from "zod";

import { zQuestionThemeAssignmentIsHint } from "@question/application/dto/zod/validators/question-theme-assignment/question-theme-assignment.dto.zod.validators";

/**
 * Validates a theme-assignment modification: `isPrimary` only accepts `true`, because promotion demotes the current primary automatically.
 */
const QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO = z.object({
  isPrimary: z.literal(true)
    .describe("Set this theme as the primary theme for the question. Only true is accepted. The current primary will be automatically demoted")
    .optional(),
  isHint: zQuestionThemeAssignmentIsHint()
    .optional(),
});

/**
 * The validated assignment modification consumers receive, where an absent flag leaves the stored value unchanged.
 */
type QuestionThemeAssignmentModificationDto = z.infer<typeof QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO>;

export type { QuestionThemeAssignmentModificationDto };

export { QUESTION_THEME_ASSIGNMENT_MODIFICATION_DTO };