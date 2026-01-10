import { QUESTION_THEME_MONGOOSE_COLLECTION_NAME } from "@question/modules/question-theme/infrastructure/persistence/mongoose/constants/question-theme.mongoose.constants";

import type { QuestionAggregatePipeline } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

/**
 * Mongoose aggregation pipeline to fetch question theme assignments for questions.
 */
const QUESTION_THEME_ASSIGNMENT_MONGOOSE_REPOSITORY_PIPELINE = [
  { $unwind: "$themes" },
  {
    $lookup: {
      from: QUESTION_THEME_MONGOOSE_COLLECTION_NAME,
      localField: "themes.themeId",
      foreignField: "_id",
      as: "themes.theme",
    },
  },
  { $unwind: "$themes.theme" },
  {
    $group: {
      _id: "$_id",
      _root: { $first: "$$ROOT" },
      themes: {
        $push: {
          theme: "$themes.theme",
          isPrimary: "$themes.isPrimary",
          isHint: "$themes.isHint",
        },
      },
    },
  },
  {
    $replaceWith: { $mergeObjects: ["$_root", { themes: "$themes" }] },
  },
] as const satisfies QuestionAggregatePipeline;

export { QUESTION_THEME_ASSIGNMENT_MONGOOSE_REPOSITORY_PIPELINE };