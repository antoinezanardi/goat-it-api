import { z } from "zod";

import {
  zQuestionThemeSlug,
  zQuestionThemeLocalizedLabel,
  zQuestionThemeLocalizedAliases,
  zQuestionThemeLocalizedDescription,
  zQuestionThemeColor,
} from "@question-theme/contracts/dto/zod/validators/question-theme/question-theme.dto.zod.validators";

/**
 * Validates a partial theme modification where every field is optional, so a request may update a single attribute.
 */
const QUESTION_THEME_MODIFICATION_DTO = z.object({
  slug: zQuestionThemeSlug()
    .optional(),
  label: zQuestionThemeLocalizedLabel()
    .optional(),
  aliases: zQuestionThemeLocalizedAliases()
    .optional(),
  description: zQuestionThemeLocalizedDescription()
    .optional(),
  color: zQuestionThemeColor()
    .optional(),
});

/**
 * The validated partial modification consumers receive, with omitted fields left untouched by the update.
 */
export type QuestionThemeModificationDto = z.infer<typeof QUESTION_THEME_MODIFICATION_DTO>;

export { QUESTION_THEME_MODIFICATION_DTO };