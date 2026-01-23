import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { areValuesUniqueByKey, hasExactlyOneByKey } from "@shared/application/dto/zod/refinements/array/array.zod.refinements";

import { QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS, QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.constants";
import { QUESTION_AUTHOR_CREATION_DTO } from "@question/application/dto/question-creation/question-author-creation/question-author-creation.dto";
import { QUESTION_CONTENT_CREATION_DTO } from "@question/application/dto/question-creation/question-content-creation/question-content-creation.dto";
import { QUESTION_THEME_ASSIGNMENT_CREATION_DTO } from "@question/application/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto";
import { zQuestionCognitiveDifficulty, zQuestionSourceUrls } from "@question/application/dto/shared/zod/validators/question.dto.zod.validators";

const QUESTION_CREATION_DTO = z.object({
  themes: z.array(QUESTION_THEME_ASSIGNMENT_CREATION_DTO)
    .min(QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS)
    .max(QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS)
    .describe("Question's themes")
    .refine(themes => areValuesUniqueByKey(themes, "themeId"), { message: "Theme IDs must be unique" })
    .refine(themes => hasExactlyOneByKey(themes, "isPrimary", true), { message: "There must be exactly one primary theme" }),
  content: QUESTION_CONTENT_CREATION_DTO,
  cognitiveDifficulty: zQuestionCognitiveDifficulty(),
  author: QUESTION_AUTHOR_CREATION_DTO,
  sourceUrls: zQuestionSourceUrls(),
});

class QuestionCreationDto extends createZodDto(QUESTION_CREATION_DTO) {}

export {
  QUESTION_CREATION_DTO,
  QuestionCreationDto,
};