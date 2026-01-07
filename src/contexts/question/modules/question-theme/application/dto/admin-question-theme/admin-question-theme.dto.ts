import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { zLocalizedText, zLocalizedTexts } from "@shared/infrastructure/http/validators/zod/localization/localization.zod.validators";
import { zIsoDateTime, zMongoId, zSlug } from "@shared/infrastructure/http/validators/zod/string/string.zod.validators";

import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

const ADMIN_QUESTION_THEME_DTO = z.strictObject({
  id: zMongoId()
    .describe("Question Theme's unique identifier"),
  slug: zSlug()
    .describe("Question Theme's unique slug in kebab-case")
    .meta({ example: "history" }),
  label: zLocalizedText()
    .describe("Question Theme's label in supported locales"),
  aliases: zLocalizedTexts()
    .describe("Question Theme's aliases in supported locales. Help to find the theme with different keywords"),
  description: zLocalizedText()
    .describe("Question Theme's description in supported locales"),
  status: z.enum(QUESTION_THEME_STATUSES)
    .describe("Question Theme's status")
    .meta({ example: "active" }),
  createdAt: zIsoDateTime()
    .describe("Question Theme's creation date"),
  updatedAt: zIsoDateTime()
    .describe("Question Theme's last update date"),
});

class AdminQuestionThemeDto extends createZodDto(ADMIN_QUESTION_THEME_DTO) {}

export {
  ADMIN_QUESTION_THEME_DTO,
  AdminQuestionThemeDto,
};