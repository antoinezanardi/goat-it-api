import { Types } from "mongoose";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import { buildIsApplicableForLocaleMatchCondition, buildQuestionAggregationFilterStages } from "@question/infrastructure/persistence/mongoose/repository/helpers/question-filter.mongoose.helpers";

import type { QuestionFilterOptions } from "@question/domain/types/question.types";

describe(buildIsApplicableForLocaleMatchCondition, () => {
  it("should return a three-branch $or match condition when locale is provided.", () => {
    const result = buildIsApplicableForLocaleMatchCondition(LOCALES[0]);

    expect(result).toStrictEqual({
      $or: [
        { applicableLocales: { $exists: false } },
        { applicableLocales: { $size: 0 } },
        { applicableLocales: LOCALES[0] },
      ],
    });
  });
});

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

  it("should return a match stage with _id $in ObjectIds when ids is defined.", () => {
    const questionId = "507f1f77bcf86cd799439013";
    const filters: Partial<QuestionFilterOptions> = { ids: [questionId] };

    const result = buildQuestionAggregationFilterStages(filters);

    expect(result).toStrictEqual([{ $match: { _id: { $in: [new Types.ObjectId(questionId)] } } }]);
  });

  it("should return a match stage with _id $in ObjectIds for multiple ids when ids has multiple values.", () => {
    const questionId1 = "507f1f77bcf86cd799439013";
    const questionId2 = "507f1f77bcf86cd799439014";
    const filters: Partial<QuestionFilterOptions> = { ids: [questionId1, questionId2] };

    const result = buildQuestionAggregationFilterStages(filters);

    expect(result).toStrictEqual([{ $match: { _id: { $in: [new Types.ObjectId(questionId1), new Types.ObjectId(questionId2)] } } }]);
  });

  it("should not add _id condition when ids is undefined.", () => {
    const filters: Partial<QuestionFilterOptions> = { status: "active" };

    const result = buildQuestionAggregationFilterStages(filters);

    expect(result).toStrictEqual([{ $match: { status: "active" } }]);
  });

  it("should not add _id condition when ids is an empty array.", () => {
    const filters: Partial<QuestionFilterOptions> = { ids: [] };

    const result = buildQuestionAggregationFilterStages(filters);

    expect(result).toStrictEqual([]);
  });

  it("should combine _id condition with themeIds condition when both are provided.", () => {
    const questionId = "507f1f77bcf86cd799439013";
    const themeId = "507f1f77bcf86cd799439011";
    const filters: Partial<QuestionFilterOptions> = { ids: [questionId], themeIds: [themeId] };

    const result = buildQuestionAggregationFilterStages(filters);

    expect(result).toStrictEqual([
      {
        $match: {
          "themes.themeId": { $in: [new Types.ObjectId(themeId)] },
          "_id": { $in: [new Types.ObjectId(questionId)] },
        },
      },
    ]);
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
      ids: [],
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

  it("should return a match stage including the locale condition when locale is provided.", () => {
    const filters: Partial<QuestionFilterOptions> = { locale: "fr" };

    const result = buildQuestionAggregationFilterStages(filters);

    expect(result).toStrictEqual([
      {
        $match: {
          $or: [
            { applicableLocales: { $exists: false } },
            { applicableLocales: { $size: 0 } },
            { applicableLocales: "fr" },
          ],
        },
      },
    ]);
  });

  it("should combine locale condition with other filter conditions when both are provided.", () => {
    const filters: Partial<QuestionFilterOptions> = { status: "active", locale: "fr" };

    const result = buildQuestionAggregationFilterStages(filters);

    expect(result).toStrictEqual([
      {
        $match: {
          status: "active",
          $or: [
            { applicableLocales: { $exists: false } },
            { applicableLocales: { $size: 0 } },
            { applicableLocales: "fr" },
          ],
        },
      },
    ]);
  });

  it("should not add locale condition when locale is undefined.", () => {
    const filters: Partial<QuestionFilterOptions> = { status: "active", locale: undefined };

    const result = buildQuestionAggregationFilterStages(filters);

    expect(result).toStrictEqual([{ $match: { status: "active" } }]);
  });
});