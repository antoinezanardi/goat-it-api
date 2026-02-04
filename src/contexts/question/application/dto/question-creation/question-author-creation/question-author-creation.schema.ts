import { z } from "zod";

import { QUESTION_AUTHOR_NAME_MAX_LENGTH, QUESTION_AUTHOR_NAME_MIN_LENGTH, QUESTION_CREATION_AUTHOR_ROLES } from "@question/domain/value-objects/question-author/question-author.constants";

const QUESTION_AUTHOR_CREATION_DTO = z.object({
  role: z.enum(QUESTION_CREATION_AUTHOR_ROLES)
    .describe("Question's author role")
    .meta({ example: QUESTION_CREATION_AUTHOR_ROLES[0] }),
  name: z.string()
    .trim()
    .min(QUESTION_AUTHOR_NAME_MIN_LENGTH)
    .max(QUESTION_AUTHOR_NAME_MAX_LENGTH)
    .describe("Question author's name")
    .meta({ example: "TriviaMaster3000" }),
}).describe("Question's author");

export { QUESTION_AUTHOR_CREATION_DTO };
