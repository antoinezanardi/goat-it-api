import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { ISO_DATE_TIME_EXAMPLE } from "@shared/infrastructure/http/validators/zod/string/constants/string.zod.validators.constants";
import { zMongoId, zSlug } from "@shared/infrastructure/http/validators/zod/string/string.zod.validators";

import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status.constants";

const QUESTION_THEME_DTO = z.strictObject({
  id: zMongoId()
    .describe("Question Theme's unique identifier."),
  slug: zSlug()
    .describe("Question Theme's unique slug in kebab-case.")
    .meta({ example: "history" }),
  label: z.string()
    .describe("Question Theme's translated label.")
    .meta({ example: "History" }),
  aliases: z.array(z.string())
    .describe("Question Theme's translated aliases. Help to find the theme with different keywords.")
    .meta({ example: ["Historical Events", "Past", "Future"] }),
  description: z.string()
    .describe("Question Theme's translated description.")
    .meta({ example: "Questions related to historical events and timelines." }),
  status: z.enum(QUESTION_THEME_STATUSES)
    .describe("Question Theme's status.")
    .meta({ example: "active" }),
  createdAt: z.iso.datetime()
    .describe("Question Theme's creation date.")
    .meta({ example: ISO_DATE_TIME_EXAMPLE }),
  updatedAt: z.iso.datetime()
    .describe("Question Theme's last update date.")
    .meta({ example: ISO_DATE_TIME_EXAMPLE }),
});

class QuestionThemeDto extends createZodDto(QUESTION_THEME_DTO) {}

export {
  QUESTION_THEME_DTO,
  QuestionThemeDto,
};