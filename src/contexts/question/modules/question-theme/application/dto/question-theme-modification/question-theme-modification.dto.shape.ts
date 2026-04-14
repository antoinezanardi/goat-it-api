import { z } from "zod";

import {
  zQuestionThemeSlug,
  zQuestionThemeLocalizedLabel,
  zQuestionThemeLocalizedAliases,
  zQuestionThemeLocalizedDescription,
  zQuestionThemeColor,
} from "@question/modules/question-theme/application/dto/zod/validators/question-theme.dto.zod.validators";

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

export type QuestionThemeModificationDto = z.infer<typeof QUESTION_THEME_MODIFICATION_DTO>;

export { QUESTION_THEME_MODIFICATION_DTO };