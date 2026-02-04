import { z } from "zod";

import { zIsoDateTime, zMongoId } from "@shared/infrastructure/http/zod/validators/string/string.zod.validators";

import { QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS, QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.constants";
import { QUESTION_THEME_ASSIGNMENT_DTO } from "@question/application/dto/question/question-theme-assignment/question-theme-assignment.dto.shape";
import { QUESTION_CONTENT_DTO } from "@question/application/dto/question/question-content/question-content.dto.shape";
import { zQuestionCognitiveDifficulty, zQuestionSourceUrls, zQuestionStatus } from "@question/application/dto/shared/zod/validators/question.dto.zod.validators";
import { QUESTION_REJECTION_DTO } from "@question/application/dto/shared/question-rejection/question-rejection.dto.shape";
import { QUESTION_AUTHOR_DTO } from "@question/application/dto/shared/question-author/question-author.dto.shape";

const QUESTION_DTO = z.strictObject({
  id: zMongoId()
    .describe("Question's unique identifier"),
  themes: z.array(QUESTION_THEME_ASSIGNMENT_DTO)
    .min(QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS)
    .max(QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS)
    .describe("Question's themes"),
  content: QUESTION_CONTENT_DTO,
  cognitiveDifficulty: zQuestionCognitiveDifficulty(),
  author: QUESTION_AUTHOR_DTO,
  status: zQuestionStatus(),
  rejection: QUESTION_REJECTION_DTO
    .optional()
    .describe("Question's rejection details, if applicable"),
  sourceUrls: zQuestionSourceUrls(),
  createdAt: zIsoDateTime()
    .describe("Question's creation date"),
  updatedAt: zIsoDateTime()
    .describe("Question's last update date"),
});

export type QuestionDto = z.infer<typeof QUESTION_DTO>;

export { QUESTION_DTO };