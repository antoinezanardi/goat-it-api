import { z } from "zod";

import { zIsoDateTime, zMongoId, zSlug } from "@shared/infrastructure/http/zod/validators/string/string.zod.validators";

import { QUESTION_THEME_SLUG_EXAMPLE } from "@question/modules/question-theme/application/dto/zod/validators/constants/question-theme.zod.validators.constants";
import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

const QUESTION_THEME_DTO = z.strictObject({
  id: zMongoId()
    .describe("Question Theme's unique identifier"),
  slug: zSlug()
    .describe("Question Theme's unique slug in kebab-case")
    .meta({ example: QUESTION_THEME_SLUG_EXAMPLE }),
  label: z.string()
    .describe("Question Theme's translated label")
    .meta({ example: "History" }),
  aliases: z.array(z.string())
    .describe("Question Theme's translated aliases. Help to find the theme with different keywords")
    .meta({ example: ["Historical Events", "Past", "Future"] }),
  description: z.string()
    .describe("Question Theme's translated description")
    .meta({ example: "Questions related to historical events and timelines." }),
  status: z.enum(QUESTION_THEME_STATUSES)
    .describe("Question Theme's status")
    .meta({ example: QUESTION_THEME_STATUSES[0] }),
  createdAt: zIsoDateTime()
    .describe("Question Theme's creation date"),
  updatedAt: zIsoDateTime()
    .describe("Question Theme's last update date"),
});

export { QUESTION_THEME_DTO };
