import { z } from "zod";

import {
  zQuestionLocalizedStatement,
  zQuestionLocalizedAnswer,
  zQuestionLocalizedContext,
  zQuestionLocalizedTrivia,
} from "@question/application/dto/zod/validators/question-content/question-content.dto.zod.validators";

/**
 * Validates a question's admin content as localized maps, so an editor reads every translation of each field.
 */
const ADMIN_QUESTION_CONTENT_DTO = z.strictObject({
  statement: zQuestionLocalizedStatement(),
  answer: zQuestionLocalizedAnswer(),
  context: zQuestionLocalizedContext()
    .optional(),
  trivia: zQuestionLocalizedTrivia()
    .optional(),
}).describe("Question's content");

/**
 * The admin content consumers receive: statement, answer, context and trivia kept as localized maps.
 */
export type AdminQuestionContentDto = z.infer<typeof ADMIN_QUESTION_CONTENT_DTO>;

export { ADMIN_QUESTION_CONTENT_DTO };