import type { QuestionAuthorRole } from "@question/domain/value-objects/question-author/question-author.types";

type QuestionAuthorDtoZodRefinement = {
  role: QuestionAuthorRole;
  gameId?: string;
  name?: string;
};

function isGameIdSetOnGameRole(questionAuthorDtoZodRefinement: QuestionAuthorDtoZodRefinement): boolean {
  const { role, gameId } = questionAuthorDtoZodRefinement;
  if (role === "game") {
    return typeof gameId === "string" && gameId.length > 0;
  }
  return gameId === undefined;
}

export {
  isGameIdSetOnGameRole,
};