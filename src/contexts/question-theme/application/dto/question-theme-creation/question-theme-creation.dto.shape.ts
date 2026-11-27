import { z } from "zod";

import {
  zQuestionThemeSlug,
  zQuestionThemeLocalizedLabel,
  zQuestionThemeLocalizedAliases,
  zQuestionThemeLocalizedDescription,
  zQuestionThemeColor,
} from "@question-theme/contracts/dto/zod/validators/question-theme/question-theme.dto.zod.validators";

/**
 * Validates a theme-creation payload: slug, localized label, aliases and description, plus an optional color.
 */
const QUESTION_THEME_CREATION_DTO = z.object({
  slug: zQuestionThemeSlug(),
  label: zQuestionThemeLocalizedLabel(),
  aliases: zQuestionThemeLocalizedAliases(),
  description: zQuestionThemeLocalizedDescription(),
  color: zQuestionThemeColor()
    .optional(),
});

/**
 * The validated theme-creation payload consumers receive; the status is not client-supplied and is defaulted by the mapper.
 */
export type QuestionThemeCreationDto = z.infer<typeof QUESTION_THEME_CREATION_DTO>;

export { QUESTION_THEME_CREATION_DTO };