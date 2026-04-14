import { z } from "zod";

import {
  zQuestionThemeId,
  zQuestionThemeSlug,
  zQuestionThemeLocalizedLabel,
  zQuestionThemeLocalizedAliases,
  zQuestionThemeLocalizedDescription,
  zQuestionThemeColor,
  zQuestionThemeStatus,
  zQuestionThemeCreatedAt,
  zQuestionThemeUpdatedAt,
} from "@question/modules/question-theme/application/dto/zod/validators/question-theme.dto.zod.validators";

const ADMIN_QUESTION_THEME_DTO = z.strictObject({
  id: zQuestionThemeId(),
  slug: zQuestionThemeSlug(),
  label: zQuestionThemeLocalizedLabel(),
  aliases: zQuestionThemeLocalizedAliases(),
  description: zQuestionThemeLocalizedDescription(),
  color: zQuestionThemeColor()
    .optional(),
  status: zQuestionThemeStatus(),
  createdAt: zQuestionThemeCreatedAt(),
  updatedAt: zQuestionThemeUpdatedAt(),
});

export type AdminQuestionThemeDto = z.infer<typeof ADMIN_QUESTION_THEME_DTO>;

export { ADMIN_QUESTION_THEME_DTO };