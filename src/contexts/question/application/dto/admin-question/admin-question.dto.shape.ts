import { z } from "zod";

import { QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS, QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.constants";
import { ADMIN_QUESTION_THEME_ASSIGNMENT_DTO } from "@question/application/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto.shape";
import { zQuestionCategory, zQuestionCognitiveDifficulty, zQuestionCreatedAt, zQuestionId, zQuestionSourceUrls, zQuestionStatus, zQuestionUpdatedAt } from "@question/application/dto/shared/zod/validators/question.dto.zod.validators";
import { QUESTION_REJECTION_DTO } from "@question/application/dto/shared/question-rejection/question-rejection.dto.shape";
import { QUESTION_AUTHOR_DTO } from "@question/application/dto/shared/question-author/question-author.dto.shape";
import { ADMIN_QUESTION_CONTENT_DTO } from "@question/application/dto/admin-question/admin-question-content/admin-question-content.dto.shape";

const ADMIN_QUESTION_DTO = z.strictObject({
  id: zQuestionId(),
  category: zQuestionCategory(),
  themes: z.array(ADMIN_QUESTION_THEME_ASSIGNMENT_DTO)
    .min(QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS)
    .max(QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS)
    .describe("Question's themes"),
  content: ADMIN_QUESTION_CONTENT_DTO,
  cognitiveDifficulty: zQuestionCognitiveDifficulty(),
  author: QUESTION_AUTHOR_DTO,
  status: zQuestionStatus(),
  rejection: QUESTION_REJECTION_DTO
    .optional()
    .describe("Question's rejection details, if applicable"),
  sourceUrls: zQuestionSourceUrls(),
  createdAt: zQuestionCreatedAt(),
  updatedAt: zQuestionUpdatedAt(),
});

export type AdminQuestionDto = z.infer<typeof ADMIN_QUESTION_DTO>;

export { ADMIN_QUESTION_DTO };