import { z } from "zod";

import {
  zQuestionLocalizedStatement,
  zQuestionLocalizedAnswer,
  zQuestionLocalizedContext,
  zQuestionLocalizedTrivia,
} from "@question/application/dto/shared/zod/validators/question-content/question-content.dto.zod.validators";

const QUESTION_CONTENT_CREATION_DTO = z.object({
  statement: zQuestionLocalizedStatement(),
  answer: zQuestionLocalizedAnswer(),
  context: zQuestionLocalizedContext()
    .optional(),
  trivia: zQuestionLocalizedTrivia()
    .optional(),
}).describe("Question's content");

export type QuestionContentCreationDto = z.infer<typeof QUESTION_CONTENT_CREATION_DTO>;

export { QUESTION_CONTENT_CREATION_DTO };