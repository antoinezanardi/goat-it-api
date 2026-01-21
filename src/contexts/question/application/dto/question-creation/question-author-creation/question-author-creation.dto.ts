import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { QUESTION_AUTHOR_CREATION_ROLES } from "@question/domain/value-objects/question-author/question-author.constants";

const QUESTION_AUTHOR_CREATION_DTO = z.object({
  role: z.enum(QUESTION_AUTHOR_CREATION_ROLES)
    .describe("Question's author role")
    .meta({ example: QUESTION_AUTHOR_CREATION_ROLES[0] }),
  name: z.string()
    .describe("Question author's name, if applicable")
    .meta({ example: "TriviaMaster3000" }),
}).describe("Question's author");

class QuestionAuthorCreationDto extends createZodDto(QUESTION_AUTHOR_CREATION_DTO) {}

export {
  QUESTION_AUTHOR_CREATION_DTO,
  QuestionAuthorCreationDto,
};