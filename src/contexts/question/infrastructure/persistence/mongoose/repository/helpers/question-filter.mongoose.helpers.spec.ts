import { Types } from "mongoose";

import { buildMongooseAggregationFilterStages } from "@question/infrastructure/persistence/mongoose/repository/helpers/question-filter.mongoose.helpers";

import type { QuestionFilterOptions } from "@question/domain/types/question.types";

describe("Build Mongoose Aggregation Filter Stages", () => {
  describe("when filters is undefined", () => {
    it("should return an empty array when called without arguments.", () => {
      const result = buildMongooseAggregationFilterStages();

      expect(result).toStrictEqual([]);
    });
  });

  describe("when filters is an empty object", () => {
    it("should return an empty array when no filter fields are defined.", () => {
      const result = buildMongooseAggregationFilterStages({});

      expect(result).toStrictEqual([]);
    });
  });

  describe("when filters has status defined", () => {
    it("should return a match stage with status when status is defined.", () => {
      const filters: Partial<QuestionFilterOptions> = { status: "pending" };

      const result = buildMongooseAggregationFilterStages(filters);

      expect(result).toStrictEqual([{ $match: { status: "pending" } }]);
    });
  });

  describe("when filters has category defined", () => {
    it("should return a match stage with category when category is defined.", () => {
      const filters: Partial<QuestionFilterOptions> = { category: "trivia" };

      const result = buildMongooseAggregationFilterStages(filters);

      expect(result).toStrictEqual([{ $match: { category: "trivia" } }]);
    });
  });

  describe("when filters has cognitiveDifficulty defined", () => {
    it("should return a match stage with cognitiveDifficulty when cognitiveDifficulty is defined.", () => {
      const filters: Partial<QuestionFilterOptions> = { cognitiveDifficulty: "easy" };

      const result = buildMongooseAggregationFilterStages(filters);

      expect(result).toStrictEqual([{ $match: { cognitiveDifficulty: "easy" } }]);
    });
  });

  describe("when filters has authorRole defined", () => {
    it("should return a match stage with author.role when authorRole is defined.", () => {
      const filters: Partial<QuestionFilterOptions> = { authorRole: "admin" };

      const result = buildMongooseAggregationFilterStages(filters);

      expect(result).toStrictEqual([{ $match: { "author.role": "admin" } }]);
    });
  });

  describe("when filters has themeIds defined", () => {
    it("should return a match stage with themes.themeId $in ObjectIds when themeIds is defined.", () => {
      const themeId = "507f1f77bcf86cd799439011";
      const filters: Partial<QuestionFilterOptions> = { themeIds: [themeId] };

      const result = buildMongooseAggregationFilterStages(filters);

      expect(result).toStrictEqual([{ $match: { "themes.themeId": { $in: [new Types.ObjectId(themeId)] } } }]);
    });
  });

  describe("when multiple filters are defined", () => {
    it("should return a single match stage with all conditions when multiple filters are defined.", () => {
      const themeId = "507f1f77bcf86cd799439011";
      const filters: Partial<QuestionFilterOptions> = {
        status: "pending",
        category: "trivia",
        authorRole: "admin",
        themeIds: [themeId],
      };

      const result = buildMongooseAggregationFilterStages(filters);

      expect(result).toStrictEqual([
        {
          $match: {
            "status": "pending",
            "category": "trivia",
            "author.role": "admin",
            "themes.themeId": { $in: [new Types.ObjectId(themeId)] },
          },
        },
      ]);
    });
  });

  describe("when all filters are defined", () => {
    it("should return a single match stage with all conditions when all filters are defined.", () => {
      const themeId = "507f1f77bcf86cd799439011";
      const filters: QuestionFilterOptions = {
        status: "pending",
        category: "trivia",
        cognitiveDifficulty: "easy",
        authorRole: "admin",
        themeIds: [themeId],
      };

      const result = buildMongooseAggregationFilterStages(filters);

      expect(result).toStrictEqual([
        {
          $match: {
            "status": "pending",
            "category": "trivia",
            "cognitiveDifficulty": "easy",
            "author.role": "admin",
            "themes.themeId": { $in: [new Types.ObjectId(themeId)] },
          },
        },
      ]);
    });
  });
});