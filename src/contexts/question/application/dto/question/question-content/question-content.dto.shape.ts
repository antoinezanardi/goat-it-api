import { z } from "zod";

import {
  zQuestionStatement,
  zQuestionAnswer,
  zQuestionContext,
  zQuestionTrivia,
} from "@question/application/dto/zod/validators/question-content/question-content.dto.zod.validators";

/**
 * Validates a question's public content with translations already resolved to plain strings.
 */
const QUESTION_CONTENT_DTO = z.strictObject({
  statement: zQuestionStatement(),
  answer: zQuestionAnswer(),
  context: zQuestionContext()
    .optional(),
  trivia: zQuestionTrivia()
    .optional(),
}).describe("Question's content");

/**
 * The public content consumers receive, in the single locale requested by the caller.
 */
export type QuestionContentDto = z.infer<typeof QUESTION_CONTENT_DTO>;

export { QUESTION_CONTENT_DTO };