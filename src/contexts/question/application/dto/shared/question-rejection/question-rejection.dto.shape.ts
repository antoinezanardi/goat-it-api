import { z } from "zod";

import { QUESTION_REJECTION_TYPES } from "@question/domain/constants/question.constants";

/**
 * Validates the rejection details of a rejected question: a rejection type and an optional explanatory comment.
 */
const QUESTION_REJECTION_DTO = z.strictObject({
  type: z.enum(QUESTION_REJECTION_TYPES)
    .describe("Question rejection's type")
    .meta({ example: QUESTION_REJECTION_TYPES[0] }),
  comment: z.string()
    .optional()
    .describe("Comment explaining the reason for rejection")
    .meta({ example: "The question is too ambiguous." }),
}).describe("Question rejection details");

/**
 * The rejection consumers receive on a rejected question; it is absent on pending and active questions.
 */
export type QuestionRejectionDto = z.infer<typeof QUESTION_REJECTION_DTO>;

export { QUESTION_REJECTION_DTO };