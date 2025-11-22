import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status.constants";

const QUESTION_THEME_DTO = z.object({
  id: z.uuid(),
  label: z.string(),
  aliases: z.string(),
  description: z.string(),
  parentId: z.uuid().nullable(),
  status: z.enum(QUESTION_THEME_STATUSES),
  createdAt: z.string(),
  updatedAt: z.string(),
});

class QuestionThemeDto extends createZodDto(QUESTION_THEME_DTO) {}

export {
  QUESTION_THEME_DTO,
  QuestionThemeDto,
};