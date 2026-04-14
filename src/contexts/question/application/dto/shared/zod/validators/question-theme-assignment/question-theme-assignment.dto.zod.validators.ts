import { z } from "zod";

import type { ZodBoolean } from "zod";

function zQuestionThemeAssignmentIsPrimary(): ZodBoolean {
  return z.boolean()
    .describe("Indicates if the assigned theme is the primary theme for the question");
}

function zQuestionThemeAssignmentIsHint(): ZodBoolean {
  return z.boolean()
    .describe("Indicates if the assigned theme is a hint for the question's answer");
}

export {
  zQuestionThemeAssignmentIsPrimary,
  zQuestionThemeAssignmentIsHint,
};