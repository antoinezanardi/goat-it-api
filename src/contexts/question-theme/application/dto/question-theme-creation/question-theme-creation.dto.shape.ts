import { z } from "zod";

import {
  zQuestionThemeSlug,
  zQuestionThemeLocalizedLabel,
  zQuestionThemeLocalizedAliases,
  zQuestionThemeLocalizedDescription,
  zQuestionThemeColor,
} from "@question-theme/contracts/dto/zod/validators/question-theme/question-theme.dto.zod.validators";

const QUESTION_THEME_CREATION_DTO = z.object({
  slug: zQuestionThemeSlug(),
  label: zQuestionThemeLocalizedLabel(),
  aliases: zQuestionThemeLocalizedAliases(),
  description: zQuestionThemeLocalizedDescription(),
  color: zQuestionThemeColor()
    .optional(),
});

export type QuestionThemeCreationDto = z.infer<typeof QUESTION_THEME_CREATION_DTO>;

export { QUESTION_THEME_CREATION_DTO };