import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { zLocalizedText, zLocalizedTexts } from "@shared/infrastructure/http/validators/zod/localization/localization.zod.validators";
import { zSlug } from "@shared/infrastructure/http/validators/zod/string/string.zod.validators";

const QUESTION_THEME_MODIFICATION_DTO = z.object({
  slug: zSlug()
    .optional()
    .describe("Question Theme's unique slug in kebab-case.")
    .meta({ example: "general-knowledge" }),
  label: zLocalizedText()
    .optional()
    .describe("Question Theme's translated label."),
  aliases: zLocalizedTexts()
    .optional()
    .describe("Question Theme's translated aliases. Help to find the theme with different keywords."),
  description: zLocalizedText()
    .optional()
    .describe("Question Theme's translated description."),
});

class QuestionThemeModificationDto extends createZodDto(QUESTION_THEME_MODIFICATION_DTO) {}

export {
  QUESTION_THEME_MODIFICATION_DTO,
  QuestionThemeModificationDto,
};