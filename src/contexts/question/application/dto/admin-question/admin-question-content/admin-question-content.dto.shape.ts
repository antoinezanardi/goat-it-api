import { z } from "zod";

import {
  zQuestionLocalizedStatement,
  zQuestionLocalizedAnswer,
  zQuestionLocalizedContext,
  zQuestionLocalizedTrivia,
} from "@question/application/dto/shared/zod/validators/question-content/question-content.dto.zod.validators";

const ADMIN_QUESTION_CONTENT_DTO = z.strictObject({
  statement: zQuestionLocalizedStatement(),
  answer: zQuestionLocalizedAnswer(),
  context: zQuestionLocalizedContext()
    .optional(),
  trivia: zQuestionLocalizedTrivia()
    .optional(),
}).describe("Question's content");

export type AdminQuestionContentDto = z.infer<typeof ADMIN_QUESTION_CONTENT_DTO>;

export { ADMIN_QUESTION_CONTENT_DTO };