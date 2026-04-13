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
} from "@question/modules/question-theme/application/dto/zod/validators/question-theme.dto.zod.validators";

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

export type QuestionThemeDto = z.infer<typeof QUESTION_THEME_DTO>;

export { QUESTION_THEME_DTO };