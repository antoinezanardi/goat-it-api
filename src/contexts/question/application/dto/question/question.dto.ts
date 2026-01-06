import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { zIsoDateTime, zMongoId } from "@shared/infrastructure/http/validators/zod/string/string.zod.validators";

import { QUESTION_THEME_ASSIGNMENT_DTO } from "@question/application/dto/question/question-theme-assignment/question-theme-assignment.dto";
import { QUESTION_CONTENT_DTO } from "@question/application/dto/question/question-content/question-content.dto";
import { zQuestionCognitiveDifficulty, zQuestionSourceUrls, zQuestionStatus } from "@question/application/dto/shared/validators/zod/question.dto.zod.validators";
import { QUESTION_REJECTION_DTO } from "@question/application/dto/shared/question-rejection/question-rejection.dto";
import { QUESTION_AUTHOR_DTO } from "@question/application/dto/shared/question-author/question-author.dto";

const QUESTION_DTO = z.strictObject({
  id: zMongoId()
    .describe("Question's unique identifier."),
  themes: z.array(QUESTION_THEME_ASSIGNMENT_DTO)
    .min(1)
    .describe("Question's themes"),
  content: QUESTION_CONTENT_DTO,
  cognitiveDifficulty: zQuestionCognitiveDifficulty(),
  author: QUESTION_AUTHOR_DTO,
  status: zQuestionStatus(),
  rejection: QUESTION_REJECTION_DTO
    .optional()
    .describe("Question's rejection details, if applicable."),
  sourceUrls: zQuestionSourceUrls(),
  createdAt: zIsoDateTime()
    .describe("Question's creation date"),
  updatedAt: zIsoDateTime()
    .describe("Question's last update date"),
});

class QuestionDto extends createZodDto(QUESTION_DTO) {}

export {
  QUESTION_DTO,
  QuestionDto,
};