import { QUESTION_STATUS_REJECTED } from "@question/domain/constants/question.constants";

const GET_STATS_FACET_STAGE = {
  $facet: {
    totalStage: [{ $count: "count" }],
    byStatusStage: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
    byCategoryStage: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
    byCognitiveDifficultyStage: [{ $group: { _id: "$cognitiveDifficulty", count: { $sum: 1 } } }],
    byAuthorRoleStage: [{ $group: { _id: "$author.role", count: { $sum: 1 } } }],
    byRejectionTypeStage: [
      { $match: { status: QUESTION_STATUS_REJECTED } },
      { $group: { _id: "$rejection.type", count: { $sum: 1 } } },
    ],
  },
};

const QUESTION_STATS_MONGOOSE_REPOSITORY_PIPELINE = [GET_STATS_FACET_STAGE];

export { QUESTION_STATS_MONGOOSE_REPOSITORY_PIPELINE };