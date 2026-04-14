import { z } from "zod";

import {
  zQuestionStatement,
  zQuestionAnswer,
  zQuestionContext,
  zQuestionTrivia,
} from "@question/application/dto/shared/zod/validators/question-content/question-content.dto.zod.validators";

const QUESTION_CONTENT_DTO = z.strictObject({
  statement: zQuestionStatement(),
  answer: zQuestionAnswer(),
  context: zQuestionContext()
    .optional(),
  trivia: zQuestionTrivia()
    .optional(),
}).describe("Question's content");

export type QuestionContentDto = z.infer<typeof QUESTION_CONTENT_DTO>;

export { QUESTION_CONTENT_DTO };