import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { QUESTION_AUTHOR_CREATION_DTO } from "@question/application/dto/question-creation/question-author-creation/question-author-creation.dto";
import { QUESTION_CONTENT_CREATION_DTO } from "@question/application/dto/question-creation/question-content-creation/question-content-creation.dto";
import { QUESTION_THEME_ASSIGNMENT_CREATION_DTO } from "@question/application/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto";
import { zQuestionCognitiveDifficulty, zQuestionSourceUrls, zQuestionStatus } from "@question/application/dto/shared/zod/validators/question.dto.zod.validators";

const QUESTION_CREATION_DTO = z.object({
  themes: z.array(QUESTION_THEME_ASSIGNMENT_CREATION_DTO)
    .min(1)
    .describe("Question's themes"),
  content: QUESTION_CONTENT_CREATION_DTO,
  cognitiveDifficulty: zQuestionCognitiveDifficulty(),
  author: QUESTION_AUTHOR_CREATION_DTO,
  status: zQuestionStatus(),
  sourceUrls: zQuestionSourceUrls(),
});

class QuestionCreationDto extends createZodDto(QUESTION_CREATION_DTO) {}

export {
  QUESTION_CREATION_DTO,
  QuestionCreationDto,
};