import { z } from "zod";

import { zLocalizedText, zLocalizedTexts } from "@shared/infrastructure/http/zod/validators/localization/localization.zod.validators";
import { zSlug } from "@shared/infrastructure/http/zod/validators/string/string.zod.validators";

import { QUESTION_THEME_SLUG_EXAMPLE } from "@question/modules/question-theme/application/dto/zod/validators/constants/question-theme.zod.validators.constants";

const QUESTION_THEME_MODIFICATION_DTO = z.object({
  slug: zSlug()
    .optional()
    .describe("Question Theme's unique slug in kebab-case")
    .meta({ example: QUESTION_THEME_SLUG_EXAMPLE }),
  label: zLocalizedText()
    .optional()
    .describe("Question Theme's translated label"),
  aliases: zLocalizedTexts()
    .optional()
    .describe("Question Theme's translated aliases. Help to find the theme with different keywords"),
  description: zLocalizedText()
    .optional()
    .describe("Question Theme's translated description"),
});

export type QuestionThemeModificationDto = z.infer<typeof QUESTION_THEME_MODIFICATION_DTO>;

export { QUESTION_THEME_MODIFICATION_DTO };