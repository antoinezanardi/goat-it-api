import { z } from "zod";

import {
  zQuestionThemeId,
  zQuestionThemeSlug,
  zQuestionThemeLabel,
  zQuestionThemeAliases,
  zQuestionThemeDescription,
  zQuestionThemeColor,
  zQuestionThemeStatus,
  zQuestionThemeCreatedAt,
  zQuestionThemeUpdatedAt,
} from "@question-theme/contracts/dto/zod/validators/question-theme/question-theme.dto.zod.validators";

/**
 * Validates a public question theme with translations resolved: a single label, alias list and description plus id, slug, optional color, status and timestamps.
 */
const QUESTION_THEME_DTO = z.strictObject({
  id: zQuestionThemeId(),
  slug: zQuestionThemeSlug(),
  label: zQuestionThemeLabel(),
  aliases: zQuestionThemeAliases(),
  description: zQuestionThemeDescription(),
  color: zQuestionThemeColor()
    .optional(),
  status: zQuestionThemeStatus(),
  createdAt: zQuestionThemeCreatedAt(),
  updatedAt: zQuestionThemeUpdatedAt(),
});

/**
 * The public theme consumers receive, already resolved for the request locale by `createQuestionThemeDtoFromEntity`.
 */
export type QuestionThemeDto = z.infer<typeof QUESTION_THEME_DTO>;

export { QUESTION_THEME_DTO };