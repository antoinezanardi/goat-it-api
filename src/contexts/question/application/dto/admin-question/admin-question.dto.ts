import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { zIsoDateTime, zMongoId } from "@shared/infrastructure/http/validators/zod/string/string.zod.validators";

import { ADMIN_QUESTION_THEME_ASSIGNMENT_DTO } from "@question/application/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto";
import { zQuestionCognitiveDifficulty, zQuestionSourceUrls, zQuestionStatus } from "@question/application/dto/shared/validators/zod/question.dto.zod.validators";
import { QUESTION_REJECTION_DTO } from "@question/application/dto/shared/question-rejection/question-rejection.dto";
import { QUESTION_AUTHOR_DTO } from "@question/application/dto/shared/question-author/question-author.dto";
import { ADMIN_QUESTION_CONTENT_DTO } from "@question/application/dto/admin-question/admin-question-content/admin-question-content.dto";

const ADMIN_QUESTION_DTO = z.strictObject({
  id: zMongoId()
    .describe("Question's unique identifier."),
  themes: z.array(ADMIN_QUESTION_THEME_ASSIGNMENT_DTO)
    .min(1)
    .describe("Question's themes"),
  content: ADMIN_QUESTION_CONTENT_DTO,
  cognitiveDifficulty: zQuestionCognitiveDifficulty(),
  author: QUESTION_AUTHOR_DTO,
  status: zQuestionStatus(),
  rejection: QUESTION_REJECTION_DTO
    .optional(),
  sourceUrls: zQuestionSourceUrls(),
  createdAt: zIsoDateTime()
    .describe("Question's creation date"),
  updatedAt: zIsoDateTime()
    .describe("Question's last update date"),
});

class AdminQuestionDto extends createZodDto(ADMIN_QUESTION_DTO) {}

export {
  ADMIN_QUESTION_DTO,
  AdminQuestionDto,
};