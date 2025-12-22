import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { zLocalizedText, zLocalizedTexts } from "@shared/infrastructure/http/validators/zod/localization/localization.zod.validators";
import { zSlug } from "@shared/infrastructure/http/validators/zod/string/string.zod.validators";

const PATCH_QUESTION_THEME_DTO = z.object({
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

class PatchQuestionThemeDto extends createZodDto(PATCH_QUESTION_THEME_DTO) {}

export {
  PATCH_QUESTION_THEME_DTO,
  PatchQuestionThemeDto,
};