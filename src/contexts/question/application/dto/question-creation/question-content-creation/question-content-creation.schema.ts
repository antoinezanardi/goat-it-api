import { z } from "zod";

import { zLocalizedText, zLocalizedTexts } from "@shared/infrastructure/http/zod/validators/localization/localization.zod.validators";

const QUESTION_CONTENT_CREATION_DTO = z.object({
  statement: zLocalizedText()
    .describe("Question statement"),
  answer: zLocalizedText()
    .describe("Question answer"),
  context: zLocalizedText()
    .optional()
    .describe("Additional context for the question"),
  trivia: zLocalizedTexts()
    .optional()
    .describe("Interesting trivia related to the question"),
}).describe("Question's content");

export { QUESTION_CONTENT_CREATION_DTO };