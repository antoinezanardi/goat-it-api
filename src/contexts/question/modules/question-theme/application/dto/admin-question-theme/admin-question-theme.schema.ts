import { z } from "zod";

import { zLocalizedText, zLocalizedTexts } from "@shared/infrastructure/http/zod/validators/localization/localization.zod.validators";
import { zIsoDateTime, zMongoId, zSlug } from "@shared/infrastructure/http/zod/validators/string/string.zod.validators";

import { QUESTION_THEME_SLUG_EXAMPLE } from "@question/modules/question-theme/application/dto/zod/validators/constants/question-theme.zod.validators.constants";
import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

const ADMIN_QUESTION_THEME_DTO = z.strictObject({
  id: zMongoId()
    .describe("Question Theme's unique identifier"),
  slug: zSlug()
    .describe("Question Theme's unique slug in kebab-case")
    .meta({ example: QUESTION_THEME_SLUG_EXAMPLE }),
  label: zLocalizedText()
    .describe("Question Theme's label in supported locales"),
  aliases: zLocalizedTexts()
    .describe("Question Theme's aliases in supported locales. Help to find the theme with different keywords"),
  description: zLocalizedText()
    .describe("Question Theme's description in supported locales"),
  status: z.enum(QUESTION_THEME_STATUSES)
    .describe("Question Theme's status")
    .meta({ example: QUESTION_THEME_STATUSES[0] }),
  createdAt: zIsoDateTime()
    .describe("Question Theme's creation date"),
  updatedAt: zIsoDateTime()
    .describe("Question Theme's last update date"),
});

export { ADMIN_QUESTION_THEME_DTO };