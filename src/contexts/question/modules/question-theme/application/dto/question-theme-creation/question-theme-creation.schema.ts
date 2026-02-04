import { z } from "zod";

import { zLocalizedText, zLocalizedTexts } from "@shared/infrastructure/http/zod/validators/localization/localization.zod.validators";
import { zSlug } from "@shared/infrastructure/http/zod/validators/string/string.zod.validators";

import { QUESTION_THEME_SLUG_EXAMPLE } from "@question/modules/question-theme/application/dto/zod/validators/constants/question-theme.zod.validators.constants";

const QUESTION_THEME_CREATION_DTO = z.object({
  slug: zSlug()
    .describe("Question Theme's unique slug in kebab-case")
    .meta({ example: QUESTION_THEME_SLUG_EXAMPLE }),
  label: zLocalizedText()
    .describe("Question Theme's translated label"),
  aliases: zLocalizedTexts()
    .describe("Question Theme's translated aliases. Help to find the theme with different keywords"),
  description: zLocalizedText()
    .describe("Question Theme's translated description"),
});

export { QUESTION_THEME_CREATION_DTO };
