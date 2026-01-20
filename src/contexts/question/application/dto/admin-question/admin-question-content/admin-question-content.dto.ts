import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { zLocalizedText, zLocalizedTexts } from "@shared/infrastructure/http/zod/validators/localization/localization.zod.validators";

const ADMIN_QUESTION_CONTENT_DTO = z.strictObject({
  statement: zLocalizedText()
    .describe("Question statement in supported locales"),
  answer: zLocalizedText()
    .describe("Question answer in supported locales"),
  context: zLocalizedText()
    .optional()
    .describe("Additional context for the question in supported locales"),
  trivia: zLocalizedTexts()
    .optional()
    .describe("Interesting trivia related to the question in supported locales"),
}).describe("Question's content");

class AdminQuestionContentDto extends createZodDto(ADMIN_QUESTION_CONTENT_DTO) {}

export {
  ADMIN_QUESTION_CONTENT_DTO,
  AdminQuestionContentDto,
};