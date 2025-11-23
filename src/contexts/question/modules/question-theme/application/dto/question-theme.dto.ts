import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status.constants";

const QUESTION_THEME_DTO = z.object({
  id: z.uuid(),
  label: z.record(z.string(), z.string()),
  aliases: z.record(z.string(), z.string().array()),
  description: z.record(z.string(), z.string()),
  parentId: z.uuid().optional(),
  status: z.enum(QUESTION_THEME_STATUSES),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

class QuestionThemeDto extends createZodDto(QUESTION_THEME_DTO) {}

export {
  QUESTION_THEME_DTO,
  QuestionThemeDto,
};