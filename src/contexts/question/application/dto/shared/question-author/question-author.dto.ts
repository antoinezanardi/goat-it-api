import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { zMongoId } from "@shared/infrastructure/http/validators/zod/string/string.zod.validators";

import { isGameIdSetOnGameRole } from "@question/application/dto/shared/zod/refinements/question-author/question-author.dto.zod.refinement";
import { QUESTION_AUTHOR_ROLES } from "@question/domain/value-objects/question-author/question-author.constants";

const QUESTION_AUTHOR_DTO = z.strictObject({
  role: z.enum(QUESTION_AUTHOR_ROLES)
    .describe("Question's author role")
    .meta({ example: QUESTION_AUTHOR_ROLES[0] }),
  gameId: zMongoId()
    .optional()
    .describe("Game's unique identifier, if the author is a game"),
  name: z.string()
    .optional()
    .describe("Question author's name, if applicable")
    .meta({ example: "TriviaMaster3000" }),
}).describe("Question's author")
  .refine(isGameIdSetOnGameRole, { error: "Game ID must be set if and only if the author role is 'game'." });

class QuestionAuthorDto extends createZodDto(QUESTION_AUTHOR_DTO) {}

export {
  QUESTION_AUTHOR_DTO,
  QuestionAuthorDto,
};