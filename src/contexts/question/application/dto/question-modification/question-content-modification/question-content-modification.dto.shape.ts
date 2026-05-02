import { z } from "zod";

import {
  zQuestionLocalizedStatement,
  zQuestionLocalizedAnswer,
  zQuestionLocalizedContext,
  zQuestionLocalizedTrivia,
} from "@question/application/dto/shared/zod/validators/question-content/question-content.dto.zod.validators";

const QUESTION_CONTENT_MODIFICATION_DTO = z.object({
  statement: zQuestionLocalizedStatement()
    .optional(),
  answer: zQuestionLocalizedAnswer()
    .optional(),
  context: zQuestionLocalizedContext()
    .optional(),
  trivia: zQuestionLocalizedTrivia()
    .optional(),
}).describe("Question's content modification payload");

type QuestionContentModificationDto = z.infer<typeof QUESTION_CONTENT_MODIFICATION_DTO>;

export type { QuestionContentModificationDto };

export { QUESTION_CONTENT_MODIFICATION_DTO };