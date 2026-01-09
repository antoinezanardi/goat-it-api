import type { QuestionAggregatePipeline } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

/**
 * Mongoose aggregation pipeline to fetch question theme assignments for questions.
 */
const QUESTION_THEME_ASSIGNMENT_MONGOOSE_REPOSITORY_PIPELINE = [
  { $unwind: "$assignments" },
  {
    $lookup: {
      from: "questionThemes",
      localField: "assignments.questionThemeId",
      foreignField: "_id",
      as: "assignments.theme",
    },
  },
  { $unwind: "$assignments.theme" },
  {
    $group: {
      _id: "$_id",
      assignments: {
        $push: {
          questionTheme: "$assignments.theme",
          isPrimary: "$assignments.isPrimary",
          isHint: "$assignments.isHint",
        },
      },
    },
  },
] as const satisfies QuestionAggregatePipeline;

export { QUESTION_THEME_ASSIGNMENT_MONGOOSE_REPOSITORY_PIPELINE };