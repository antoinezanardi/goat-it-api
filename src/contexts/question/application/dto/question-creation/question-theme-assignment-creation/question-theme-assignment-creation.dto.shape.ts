import { z } from "zod";

import { zMongoId } from "@shared/infrastructure/http/zod/validators/string/string.zod.validators";

const QUESTION_THEME_ASSIGNMENT_CREATION_DTO = z.object({
  themeId: zMongoId()
    .describe("The ID of the theme to assign to the question"),
  isPrimary: z.boolean()
    .describe("Indicates if the assigned theme is the primary theme for the question. Only one primary theme is allowed per question"),
  isHint: z.boolean()
    .describe("Indicates if the assigned theme is a hint for the question's answer"),
});

export type QuestionThemeAssignmentCreationDto = z.infer<typeof QUESTION_THEME_ASSIGNMENT_CREATION_DTO>;

export { QUESTION_THEME_ASSIGNMENT_CREATION_DTO };