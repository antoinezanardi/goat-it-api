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
      isFullyTranslated: true,
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
          "$and": [
            {
              "content.statement.en": { $ne: null },
              "content.statement.fr": { $ne: null },
              "content.statement.es": { $ne: null },
              "content.statement.de": { $ne: null },
              "content.statement.it": { $ne: null },
              "content.statement.pt": { $ne: null },
            },
            {
              "content.answer.en": { $ne: null },
              "content.answer.fr": { $ne: null },
              "content.answer.es": { $ne: null },
              "content.answer.de": { $ne: null },
              "content.answer.it": { $ne: null },
              "content.answer.pt": { $ne: null },
            },
            {
              $or: [
                { "content.context": null },
                {
                  "content.context.en": { $ne: null },
                  "content.context.fr": { $ne: null },
                  "content.context.es": { $ne: null },
                  "content.context.de": { $ne: null },
                  "content.context.it": { $ne: null },
                  "content.context.pt": { $ne: null },
                },
              ],
            },
            {
              $or: [
                { "content.trivia": null },
                {
                  "content.trivia.en": { $ne: null },
                  "content.trivia.fr": { $ne: null },
                  "content.trivia.es": { $ne: null },
                  "content.trivia.de": { $ne: null },
                  "content.trivia.it": { $ne: null },
                  "content.trivia.pt": { $ne: null },
                },
              ],
            },
          ],
        },
      },
    ]);
  });

  it.each<{ name: string; filters: Partial<QuestionFilterOptions>; expected: Record<string, unknown> }>([
    {
      name: "isFullyTranslated: true",
      filters: { isFullyTranslated: true },
      expected: {
        $and: [
          {
            "content.statement.en": { $ne: null },
            "content.statement.fr": { $ne: null },
            "content.statement.es": { $ne: null },
            "content.statement.de": { $ne: null },
            "content.statement.it": { $ne: null },
            "content.statement.pt": { $ne: null },
          },
          {
            "content.answer.en": { $ne: null },
            "content.answer.fr": { $ne: null },
            "content.answer.es": { $ne: null },
            "content.answer.de": { $ne: null },
            "content.answer.it": { $ne: null },
            "content.answer.pt": { $ne: null },
          },
          {
            $or: [
              { "content.context": null },
              {
                "content.context.en": { $ne: null },
                "content.context.fr": { $ne: null },
                "content.context.es": { $ne: null },
                "content.context.de": { $ne: null },
                "content.context.it": { $ne: null },
                "content.context.pt": { $ne: null },
              },
            ],
          },
          {
            $or: [
              { "content.trivia": null },
              {
                "content.trivia.en": { $ne: null },
                "content.trivia.fr": { $ne: null },
                "content.trivia.es": { $ne: null },
                "content.trivia.de": { $ne: null },
                "content.trivia.it": { $ne: null },
                "content.trivia.pt": { $ne: null },
              },
            ],
          },
        ],
      },
    },
    {
      name: "isFullyTranslated: false",
      filters: { isFullyTranslated: false },
      expected: {
        $or: [
          {
            $or: [
              { "content.statement.en": null },
              { "content.statement.fr": null },
              { "content.statement.es": null },
              { "content.statement.de": null },
              { "content.statement.it": null },
              { "content.statement.pt": null },
            ],
          },
          {
            $or: [
              { "content.answer.en": null },
              { "content.answer.fr": null },
              { "content.answer.es": null },
              { "content.answer.de": null },
              { "content.answer.it": null },
              { "content.answer.pt": null },
            ],
          },
          {
            $and: [
              { "content.context": { $ne: null } },
              {
                $or: [
                  { "content.context.en": null },
                  { "content.context.fr": null },
                  { "content.context.es": null },
                  { "content.context.de": null },
                  { "content.context.it": null },
                  { "content.context.pt": null },
                ],
              },
            ],
          },
          {
            $and: [
              { "content.trivia": { $ne: null } },
              {
                $or: [
                  { "content.trivia.en": null },
                  { "content.trivia.fr": null },
                  { "content.trivia.es": null },
                  { "content.trivia.de": null },
                  { "content.trivia.it": null },
                  { "content.trivia.pt": null },
                ],
              },
            ],
          },
        ],
      },
    },
  ])("should return expected match stage when $name.", ({ filters, expected }) => {
    const result = buildQuestionAggregationFilterStages(filters);

    expect(result).toStrictEqual([{ $match: expected }]);
  });

  it("should return a match stage combining status and translation completeness filters when both are provided.", () => {
    const filters: Partial<QuestionFilterOptions> = { status: "active", isFullyTranslated: false };

    const result = buildQuestionAggregationFilterStages(filters);

    expect(result).toStrictEqual([
      {
        $match: {
          status: "active",
          $or: [
            {
              $or: [
                { "content.statement.en": null },
                { "content.statement.fr": null },
                { "content.statement.es": null },
                { "content.statement.de": null },
                { "content.statement.it": null },
                { "content.statement.pt": null },
              ],
            },
            {
              $or: [
                { "content.answer.en": null },
                { "content.answer.fr": null },
                { "content.answer.es": null },
                { "content.answer.de": null },
                { "content.answer.it": null },
                { "content.answer.pt": null },
              ],
            },
            {
              $and: [
                { "content.context": { $ne: null } },
                {
                  $or: [
                    { "content.context.en": null },
                    { "content.context.fr": null },
                    { "content.context.es": null },
                    { "content.context.de": null },
                    { "content.context.it": null },
                    { "content.context.pt": null },
                  ],
                },
              ],
            },
            {
              $and: [
                { "content.trivia": { $ne: null } },
                {
                  $or: [
                    { "content.trivia.en": null },
                    { "content.trivia.fr": null },
                    { "content.trivia.es": null },
                    { "content.trivia.de": null },
                    { "content.trivia.it": null },
                    { "content.trivia.pt": null },
                  ],
                },
              ],
            },
          ],
        },
      },
    ]);
  });
});