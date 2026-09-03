import { Types } from "mongoose";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import { buildQuestionAggregationFilterStages } from "@question/infrastructure/persistence/mongoose/repository/helpers/question-filter.mongoose.helpers";

import type { QuestionFilterOptions } from "@question/domain/types/question.types";

describe(buildQuestionAggregationFilterStages, () => {
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
          "$expr": {
            $and: [
              {
                $allElementsTrue: [
                  {
                    $map: {
                      input: {
                        $cond: [
                          { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                          LOCALES,
                          "$applicableLocales",
                        ],
                      },
                      as: "locale",
                      in: { $gt: [{ $getField: { field: "$$locale", input: "$content.statement" } }, null] },
                    },
                  },
                ],
              },
              {
                $allElementsTrue: [
                  {
                    $map: {
                      input: {
                        $cond: [
                          { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                          LOCALES,
                          "$applicableLocales",
                        ],
                      },
                      as: "locale",
                      in: { $gt: [{ $getField: { field: "$$locale", input: "$content.answer" } }, null] },
                    },
                  },
                ],
              },
              {
                $or: [
                  { $not: { $gt: ["$content.context", null] } },
                  {
                    $allElementsTrue: [
                      {
                        $map: {
                          input: {
                            $cond: [
                              { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                              LOCALES,
                              "$applicableLocales",
                            ],
                          },
                          as: "locale",
                          in: { $gt: [{ $getField: { field: "$$locale", input: "$content.context" } }, null] },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                $or: [
                  { $not: { $gt: ["$content.trivia", null] } },
                  {
                    $allElementsTrue: [
                      {
                        $map: {
                          input: {
                            $cond: [
                              { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                              LOCALES,
                              "$applicableLocales",
                            ],
                          },
                          as: "locale",
                          in: { $gt: [{ $getField: { field: "$$locale", input: "$content.trivia" } }, null] },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    ]);
  });

  it.each<{ name: string; filters: Partial<QuestionFilterOptions>; expected: Record<string, unknown> }>([
    {
      name: "isFullyTranslated: true",
      filters: { isFullyTranslated: true },
      expected: {
        $expr: {
          $and: [
            {
              $allElementsTrue: [
                {
                  $map: {
                    input: {
                      $cond: [
                        { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                        LOCALES,
                        "$applicableLocales",
                      ],
                    },
                    as: "locale",
                    in: { $gt: [{ $getField: { field: "$$locale", input: "$content.statement" } }, null] },
                  },
                },
              ],
            },
            {
              $allElementsTrue: [
                {
                  $map: {
                    input: {
                      $cond: [
                        { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                        LOCALES,
                        "$applicableLocales",
                      ],
                    },
                    as: "locale",
                    in: { $gt: [{ $getField: { field: "$$locale", input: "$content.answer" } }, null] },
                  },
                },
              ],
            },
            {
              $or: [
                { $not: { $gt: ["$content.context", null] } },
                {
                  $allElementsTrue: [
                    {
                      $map: {
                        input: {
                          $cond: [
                            { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                            LOCALES,
                            "$applicableLocales",
                          ],
                        },
                        as: "locale",
                        in: { $gt: [{ $getField: { field: "$$locale", input: "$content.context" } }, null] },
                      },
                    },
                  ],
                },
              ],
            },
            {
              $or: [
                { $not: { $gt: ["$content.trivia", null] } },
                {
                  $allElementsTrue: [
                    {
                      $map: {
                        input: {
                          $cond: [
                            { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                            LOCALES,
                            "$applicableLocales",
                          ],
                        },
                        as: "locale",
                        in: { $gt: [{ $getField: { field: "$$locale", input: "$content.trivia" } }, null] },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
    {
      name: "isFullyTranslated: false",
      filters: { isFullyTranslated: false },
      expected: {
        $expr: {
          $or: [
            {
              $anyElementTrue: [
                {
                  $map: {
                    input: {
                      $cond: [
                        { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                        LOCALES,
                        "$applicableLocales",
                      ],
                    },
                    as: "locale",
                    in: { $not: { $gt: [{ $getField: { field: "$$locale", input: "$content.statement" } }, null] } },
                  },
                },
              ],
            },
            {
              $anyElementTrue: [
                {
                  $map: {
                    input: {
                      $cond: [
                        { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                        LOCALES,
                        "$applicableLocales",
                      ],
                    },
                    as: "locale",
                    in: { $not: { $gt: [{ $getField: { field: "$$locale", input: "$content.answer" } }, null] } },
                  },
                },
              ],
            },
            {
              $and: [
                { $gt: ["$content.context", null] },
                {
                  $anyElementTrue: [
                    {
                      $map: {
                        input: {
                          $cond: [
                            { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                            LOCALES,
                            "$applicableLocales",
                          ],
                        },
                        as: "locale",
                        in: { $not: { $gt: [{ $getField: { field: "$$locale", input: "$content.context" } }, null] } },
                      },
                    },
                  ],
                },
              ],
            },
            {
              $and: [
                { $gt: ["$content.trivia", null] },
                {
                  $anyElementTrue: [
                    {
                      $map: {
                        input: {
                          $cond: [
                            { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                            LOCALES,
                            "$applicableLocales",
                          ],
                        },
                        as: "locale",
                        in: { $not: { $gt: [{ $getField: { field: "$$locale", input: "$content.trivia" } }, null] } },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  ])("should return expected $expr match stage when $name.", ({ filters, expected }) => {
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
          $expr: {
            $or: [
              {
                $anyElementTrue: [
                  {
                    $map: {
                      input: {
                        $cond: [
                          { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                          LOCALES,
                          "$applicableLocales",
                        ],
                      },
                      as: "locale",
                      in: { $not: { $gt: [{ $getField: { field: "$$locale", input: "$content.statement" } }, null] } },
                    },
                  },
                ],
              },
              {
                $anyElementTrue: [
                  {
                    $map: {
                      input: {
                        $cond: [
                          { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                          LOCALES,
                          "$applicableLocales",
                        ],
                      },
                      as: "locale",
                      in: { $not: { $gt: [{ $getField: { field: "$$locale", input: "$content.answer" } }, null] } },
                    },
                  },
                ],
              },
              {
                $and: [
                  { $gt: ["$content.context", null] },
                  {
                    $anyElementTrue: [
                      {
                        $map: {
                          input: {
                            $cond: [
                              { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                              LOCALES,
                              "$applicableLocales",
                            ],
                          },
                          as: "locale",
                          in: { $not: { $gt: [{ $getField: { field: "$$locale", input: "$content.context" } }, null] } },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                $and: [
                  { $gt: ["$content.trivia", null] },
                  {
                    $anyElementTrue: [
                      {
                        $map: {
                          input: {
                            $cond: [
                              { $eq: [{ $size: { $ifNull: ["$applicableLocales", []] } }, 0] },
                              LOCALES,
                              "$applicableLocales",
                            ],
                          },
                          as: "locale",
                          in: { $not: { $gt: [{ $getField: { field: "$$locale", input: "$content.trivia" } }, null] } },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    ]);
  });
});