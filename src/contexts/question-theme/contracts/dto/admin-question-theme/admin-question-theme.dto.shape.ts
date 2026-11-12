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
} from "@question-theme/contracts/dto/zod/validators/question-theme/question-theme.dto.zod.validators";

/**
 * Validates an admin question theme as localized maps, plus its id, slug, optional color, status and timestamps.
 */
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

/**
 * The admin theme consumers receive, keeping every translation visible for editing.
 */
export type AdminQuestionThemeDto = z.infer<typeof ADMIN_QUESTION_THEME_DTO>;

export { ADMIN_QUESTION_THEME_DTO };