import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { zLocalizedText, zLocalizedTexts } from "@shared/infrastructure/http/validators/zod/localization/localization.zod.validators";
import { zSlug } from "@shared/infrastructure/http/validators/zod/string/string.zod.validators";

const QUESTION_THEME_CREATION_DTO = z.object({
  slug: zSlug()
    .describe("Question Theme's unique slug in kebab-case")
    .meta({ example: "general-knowledge" }),
  label: zLocalizedText()
    .describe("Question Theme's translated label."),
  aliases: zLocalizedTexts()
    .describe("Question Theme's translated aliases. Help to find the theme with different keywords."),
  description: zLocalizedText()
    .describe("Question Theme's translated description."),
});

class QuestionThemeCreationDto extends createZodDto(QUESTION_THEME_CREATION_DTO) {}

export {
  QUESTION_THEME_CREATION_DTO,
  QuestionThemeCreationDto,
};