import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status.constants";

const QUESTION_THEME_DTO = z.object({
  id: z.string()
    .regex(/^[\da-f]{24}$/iu)
    .describe("Question Theme's unique identifier."),
  label: z.string()
    .describe("Question Theme's translated label."),
  aliases: z.string().array()
    .describe("Question Theme's translated aliases. Help to find the theme with different keywords."),
  description: z.string()
    .describe("Question Theme's translated description."),
  parentId: z.string()
    .regex(/^[\da-f]{24}$/iu)
    .optional()
    .describe("Question Theme's parent unique identifier, if any. If not present, the theme is a root theme. Else, it's a sub-theme."),
  status: z.enum(QUESTION_THEME_STATUSES)
    .describe("Question Theme's status."),
  createdAt: z.iso.datetime()
    .describe("Question Theme's creation date."),
  updatedAt: z.iso.datetime()
    .describe("Question Theme's last update date."),
});

class QuestionThemeDto extends createZodDto(QUESTION_THEME_DTO) {}

export {
  QUESTION_THEME_DTO,
  QuestionThemeDto,
};