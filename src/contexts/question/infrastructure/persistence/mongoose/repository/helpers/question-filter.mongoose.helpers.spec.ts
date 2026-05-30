import { Types } from "mongoose";

import { buildQuestionAggregationFilterStages } from "@question/infrastructure/persistence/mongoose/repository/helpers/question-filter.mongoose.helpers";

import type { QuestionFilterOptions } from "@question/domain/types/question.types";

describe("Build Question Aggregation Filter Stages", () => {
  it("should return an empty array when called without arguments.", () => {
    const result = buildQuestionAggregationFilterStages();

    expect(result).toStrictEqual([]);
  });

  it("should return an empty array when no filter fields are defined.", () => {
    const result = buildQuestionAggregationFilterStages({});

    expect(result).toStrictEqual([]);
  });

  it.each<{ filter: Partial<QuestionFilterOptions>; expectedMatch: Record<string, unknown> }>([
    { filter: { status: "pending" }, expectedMatch: { status: "pending" } },
    { filter: { category: "trivia" }, expectedMatch: { category: "trivia" } },
    { filter: { cognitiveDifficulty: "easy" }, expectedMatch: { cognitiveDifficulty: "easy" } },
    { filter: { authorRole: "admin" }, expectedMatch: { "author.role": "admin" } },
  ])("should return a match stage with expected conditions when filter is $filter.", ({ filter, expectedMatch }) => {
    const result = buildQuestionAggregationFilterStages(filter);

    expect(result).toStrictEqual([{ $match: expectedMatch }]);
  });

  it("should return a match stage with themes.themeId $in ObjectIds when themeIds is defined.", () => {
    const themeId = "507f1f77bcf86cd799439011";
    const filters: Partial<QuestionFilterOptions> = { themeIds: [themeId] };

    const result = buildQuestionAggregationFilterStages(filters);

    expect(result).toStrictEqual([{ $match: { "themes.themeId": { $in: [new Types.ObjectId(themeId)] } } }]);
  });

  it("should return a single match stage with all conditions when multiple filters are defined.", () => {
    const themeId = "507f1f77bcf86cd799439011";
    const filters: Partial<QuestionFilterOptions> = {
      status: "pending",
      category: "trivia",
      authorRole: "admin",
      themeIds: [themeId],
    };

    const result = buildQuestionAggregationFilterStages(filters);

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

  it("should return a single match stage with all conditions when all filters are defined.", () => {
    const themeId = "507f1f77bcf86cd799439011";
    const filters: QuestionFilterOptions = {
      status: "pending",
      category: "trivia",
      cognitiveDifficulty: "easy",
      authorRole: "admin",
      themeIds: [themeId],
    };

    const result = buildQuestionAggregationFilterStages(filters);

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