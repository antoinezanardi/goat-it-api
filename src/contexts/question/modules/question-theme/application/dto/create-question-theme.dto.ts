import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { zLocalizedText, zLocalizedTexts } from "@shared/infrastructure/http/validators/zod/localization/localization.zod.validators";
import { zSlug } from "@shared/infrastructure/http/validators/zod/string/string.zod.validators";

const CREATE_QUESTION_THEME_DTO = z.object({
  slug: zSlug()
    .describe("Question Theme's unique slug in kebab-case."),
  label: zLocalizedText()
    .describe("Question Theme's translated label."),
  aliases: zLocalizedTexts()
    .describe("Question Theme's translated aliases. Help to find the theme with different keywords."),
  description: zLocalizedText()
    .describe("Question Theme's translated description."),
});

class CreateQuestionThemeDTO extends createZodDto(CREATE_QUESTION_THEME_DTO) {}

export {
  CREATE_QUESTION_THEME_DTO,
  CreateQuestionThemeDTO,
};