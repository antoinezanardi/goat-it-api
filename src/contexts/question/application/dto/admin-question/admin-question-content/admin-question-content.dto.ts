import { z } from "zod";

import { zLocalizedText, zLocalizedTexts } from "@shared/infrastructure/http/validators/zod/localization/localization.zod.validators";

const ADMIN_QUESTION_CONTENT_DTO = z.strictObject({
  statement: zLocalizedText()
    .describe("Question statement in supported locales."),
  answer: zLocalizedText()
    .describe("Question explanation in supported locales."),
  context: zLocalizedText()
    .optional()
    .describe("Additional context for the question in supported locales."),
  trivia: zLocalizedTexts()
    .optional()
    .describe("Interesting trivia related to the question in supported locales."),
}).describe("Question's content.");

export {
  ADMIN_QUESTION_CONTENT_DTO,
};