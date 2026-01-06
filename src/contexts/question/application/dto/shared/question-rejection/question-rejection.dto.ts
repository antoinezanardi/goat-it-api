import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { QUESTION_REJECTION_TYPES } from "@question/domain/value-objects/question-rejection/question-rejection.constants";

const QUESTION_REJECTION_DTO = z.strictObject({
  type: z.enum(QUESTION_REJECTION_TYPES)
    .describe("Question rejection's type")
    .meta({ example: QUESTION_REJECTION_TYPES[0] }),
  comment: z.string()
    .optional()
    .describe("Comment explaining the reason for rejection.")
    .meta({ example: "The question is too ambiguous." }),
}).describe("Question rejection details.");

class QuestionRejectionDto extends createZodDto(QUESTION_REJECTION_DTO) {}

export {
  QUESTION_REJECTION_DTO,
  QuestionRejectionDto,
};