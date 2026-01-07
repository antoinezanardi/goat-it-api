import { isGameIdSetOnGameRole } from "@question/application/dto/shared/zod/refinements/question-author/question-author.dto.zod.refinement";

import type { QuestionAuthorRole } from "@question/domain/value-objects/question-author/question-author.types";

describe("Question Author Dto Zod Refinement", () => {
  describe(isGameIdSetOnGameRole, () => {
    it.each<{
      test: string;
      dto: {
        role: QuestionAuthorRole;
        gameId?: string;
      };
      expected: boolean;
    }>([
      {
        test: "should return true when role is 'game' and gameId is provided.",
        dto: { role: "game", gameId: "some-game-id" },
        expected: true,
      },
      {
        test: "should return false when role is 'game' and gameId is not provided.",
        dto: { role: "game" },
        expected: false,
      },
      {
        test: "should return true when role is 'ai' and gameId is not provided.",
        dto: { role: "ai" },
        expected: true,
      },
      {
        test: "should return false when role is 'ai' and gameId is provided.",
        dto: { role: "ai", gameId: "some-game-id" },
        expected: false,
      },
      {
        test: "should return true when role is 'admin' and gameId is not provided.",
        dto: { role: "admin" },
        expected: true,
      },
      {
        test: "should return false when role is 'admin' and gameId is provided.",
        dto: { role: "admin", gameId: "some-game-id" },
        expected: false,
      },
      {
        test: "should return false when role is game and gameId is an empty string.",
        dto: { role: "game", gameId: "" },
        expected: false,
      },
    ])("$test", ({ dto, expected }) => {
      const isDtoValid = isGameIdSetOnGameRole(dto);

      expect(isDtoValid).toBe(expected);
    });
  });
});