import { createPublicQuestionFilterOptionsFromQueryDto, createQuestionFilterOptionsFromQueryDto } from "@question/application/mappers/question-filter-query-dto/question-filter-query-dto.mappers";
import type { AdminFindQuestionsQueryDto } from "@question/application/dto/admin-find-questions-query/admin-find-questions-query.dto.shape";
import type { FindQuestionsQueryDto } from "@question/application/dto/find-questions-query/find-questions-query.dto.shape";

import type { PublicQuestionFilterOptions, QuestionFilterOptions } from "@question/domain/types/question.types";

describe("Question Filter Query DTO Mappers", () => {
  describe(createQuestionFilterOptionsFromQueryDto, () => {
    it("should return all filter options when all filter fields are provided.", () => {
      const dto: AdminFindQuestionsQueryDto = {
        "sort-by": "createdAt",
        "sort-order": "desc",
        "status": "active",
        "category": "trivia",
        "cognitive-difficulty": "hard",
        "author-role": "admin",
        "theme-ids": ["507f1f77bcf86cd799439011"],
      };

      const result = createQuestionFilterOptionsFromQueryDto(dto);

      const expected: Partial<QuestionFilterOptions> = {
        status: "active",
        category: "trivia",
        cognitiveDifficulty: "hard",
        authorRole: "admin",
        themeIds: ["507f1f77bcf86cd799439011"],
      };

      expect(result).toStrictEqual(expected);
    });

    it("should return only defined filter options when some filter fields are provided.", () => {
      const dto: AdminFindQuestionsQueryDto = {
        "sort-by": "createdAt",
        "sort-order": "desc",
        "status": "pending",
      };

      const result = createQuestionFilterOptionsFromQueryDto(dto);

      const expected: Partial<QuestionFilterOptions> = { status: "pending" };

      expect(result).toStrictEqual(expected);
    });

    it("should return undefined when no filter fields are provided.", () => {
      const dto: AdminFindQuestionsQueryDto = {
        "sort-by": "createdAt",
        "sort-order": "desc",
      };

      const result = createQuestionFilterOptionsFromQueryDto(dto);

      expect(result).toBeUndefined();
    });
  });

  describe(createPublicQuestionFilterOptionsFromQueryDto, () => {
    it("should return all public filter options when all filter fields are provided.", () => {
      const dto: FindQuestionsQueryDto = {
        "sort-by": "createdAt",
        "sort-order": "desc",
        "category": "lexicon",
        "cognitive-difficulty": "easy",
        "author-role": "game",
        "theme-ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
      };

      const result = createPublicQuestionFilterOptionsFromQueryDto(dto);

      const expected: Partial<PublicQuestionFilterOptions> = {
        category: "lexicon",
        cognitiveDifficulty: "easy",
        authorRole: "game",
        themeIds: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
      };

      expect(result).toStrictEqual(expected);
    });

    it("should return only defined filter options when some filter fields are provided.", () => {
      const dto: FindQuestionsQueryDto = {
        "sort-by": "createdAt",
        "sort-order": "desc",
        "category": "riddle",
      };

      const result = createPublicQuestionFilterOptionsFromQueryDto(dto);

      const expected: Partial<PublicQuestionFilterOptions> = { category: "riddle" };

      expect(result).toStrictEqual(expected);
    });

    it("should return undefined when no filter fields are provided.", () => {
      const dto: FindQuestionsQueryDto = {
        "sort-by": "createdAt",
        "sort-order": "desc",
      };

      const result = createPublicQuestionFilterOptionsFromQueryDto(dto);

      expect(result).toBeUndefined();
    });
  });
});