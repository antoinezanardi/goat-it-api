import { QUESTION_STATUS_REJECTED } from "@question/domain/constants/question.constants";

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

const GET_STATS_FACET_STAGE = {
  $facet: {
    totalStage: [{ $count: "count" }],
    byStatusStage: [
      { $group: { _id: "$status", count: { $sum: 1 } } },
      FILTER_NULL_ID_STAGE,
      ...ROWS_TO_RECORD_STAGES,
    ],
    byCategoryStage: [
      { $group: { _id: "$category", count: { $sum: 1 } } },
      FILTER_NULL_ID_STAGE,
      ...ROWS_TO_RECORD_STAGES,
    ],
    byCognitiveDifficultyStage: [
      { $group: { _id: "$cognitiveDifficulty", count: { $sum: 1 } } },
      FILTER_NULL_ID_STAGE,
      ...ROWS_TO_RECORD_STAGES,
    ],
    byAuthorRoleStage: [
      { $group: { _id: "$author.role", count: { $sum: 1 } } },
      FILTER_NULL_ID_STAGE,
      ...ROWS_TO_RECORD_STAGES,
    ],
    byRejectionTypeStage: [
      { $match: { status: QUESTION_STATUS_REJECTED } },
      { $group: { _id: "$rejection.type", count: { $sum: 1 } } },
      FILTER_NULL_ID_STAGE,
      ...ROWS_TO_RECORD_STAGES,
    ],
  },
};

const QUESTION_STATS_MONGOOSE_REPOSITORY_PIPELINE = [GET_STATS_FACET_STAGE];

export { QUESTION_STATS_MONGOOSE_REPOSITORY_PIPELINE };