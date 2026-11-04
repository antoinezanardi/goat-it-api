import { QUESTION_AUTHOR_ROLE_GAME } from "@question/domain/constants/question.constants";

import type { QuestionAuthorDtoZodRefinement } from "@question/application/dto/zod/refinements/question-author/question-author.dto.zod.refinements.types";

function isGameIdSetOnGameRole(questionAuthorDtoZodRefinement: QuestionAuthorDtoZodRefinement): boolean {
  const { role, gameId } = questionAuthorDtoZodRefinement;
  if (role === QUESTION_AUTHOR_ROLE_GAME) {
    return typeof gameId === "string" && gameId.length > 0;
  }
  return gameId === undefined;
}

export {
  isGameIdSetOnGameRole,
};