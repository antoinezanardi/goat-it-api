import { QUESTION_STATUS_ACTIVE } from "@question/domain/constants/question.constants";

// Acceptable as MongoDB query syntax — null matches missing grouped field values
// oxlint-disable-next-line unicorn/no-null
const FILTER_NULL_ID_STAGE = { $match: { _id: { $ne: null } } };

const ROWS_TO_RECORD_STAGES = [
  // Acceptable as MongoDB $group + $arrayToObject + $replaceRoot operator field names
  // oxlint-disable-next-line eslint/id-length, unicorn/no-null
  { $group: { _id: null, pairs: { $push: { k: "$_id", v: "$count" } } } },
  // eslint-disable-next-line unicorn/no-keyword-prefix
  { $replaceRoot: { newRoot: { $arrayToObject: "$pairs" } } },
];

const QUESTION_THEME_ACTIVE_QUESTION_COUNT_LOOKUP_STAGE = {
  $lookup: {
    from: "questions",
    let: { themeId: "$_id" },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $in: ["$$themeId", "$themes.themeId"] },
              { $eq: ["$status", QUESTION_STATUS_ACTIVE] },
            ],
          },
        },
      },
      { $count: "count" },
    ],
    as: "activeQuestionLookup",
  },
};

const QUESTION_THEME_ACTIVE_QUESTION_COUNT_ADD_FIELDS_STAGE = {
  $addFields: {
    activeQuestionCount: { $ifNull: [{ $arrayElemAt: ["$activeQuestionLookup.count", 0] }, 0] },
  },
};

const QUESTION_THEME_STATS_FACET_STAGE = {
  $facet: {
    total: [{ $count: "count" }],
    statusRows: [
      { $group: { _id: "$status", count: { $sum: 1 } } },
      FILTER_NULL_ID_STAGE,
      ...ROWS_TO_RECORD_STAGES,
    ],
    byQuestionCount: [
      { $sort: { slug: 1 as const } },
      {
        $project: {
          _id: 0 as const,
          themeId: { $toString: "$_id" },
          themeSlug: "$slug",
          activeQuestionCount: 1 as const,
        },
      },
    ],
  },
};

const QUESTION_THEME_STATS_MONGOOSE_REPOSITORY_PIPELINE = [
  QUESTION_THEME_ACTIVE_QUESTION_COUNT_LOOKUP_STAGE,
  QUESTION_THEME_ACTIVE_QUESTION_COUNT_ADD_FIELDS_STAGE,
  QUESTION_THEME_STATS_FACET_STAGE,
];

export { QUESTION_THEME_STATS_MONGOOSE_REPOSITORY_PIPELINE };