import { QUESTION_STATUS_ACTIVE } from "@question/domain/constants/question.constants";

const GET_THEME_FACET_STAGE = {
  $facet: {
    total: [{ $count: "count" }],
    statusRows: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
  },
};

const QUESTION_THEME_FACET_MONGOOSE_REPOSITORY_PIPELINE = [GET_THEME_FACET_STAGE];

const GET_ACTIVE_QUESTION_COUNT_PIPELINE = [
  { $match: { status: QUESTION_STATUS_ACTIVE } },
  { $unwind: "$themes" },
  { $group: { _id: "$themes.themeId", count: { $sum: 1 } } },
];

const QUESTION_ACTIVE_QUESTION_COUNT_MONGOOSE_REPOSITORY_PIPELINE = GET_ACTIVE_QUESTION_COUNT_PIPELINE;

export { QUESTION_THEME_FACET_MONGOOSE_REPOSITORY_PIPELINE, QUESTION_ACTIVE_QUESTION_COUNT_MONGOOSE_REPOSITORY_PIPELINE };