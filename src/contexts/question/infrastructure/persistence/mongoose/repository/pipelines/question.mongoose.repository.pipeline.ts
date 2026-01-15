import { QUESTION_THEME_ASSIGNMENT_MONGOOSE_REPOSITORY_PIPELINE } from "@question/infrastructure/persistence/mongoose/repository/pipelines/question-theme-assignment/question-theme-assignment.mongoose.repository.pipeline";

import type { QuestionAggregatePipeline } from "@question/infrastructure/persistence/mongoose/types/question.mongoose.types";

const QUESTION_MONGOOSE_REPOSITORY_PIPELINE = [
  ...QUESTION_THEME_ASSIGNMENT_MONGOOSE_REPOSITORY_PIPELINE,
  { $sort: { _id: 1 } },
] as const satisfies QuestionAggregatePipeline;

export { QUESTION_MONGOOSE_REPOSITORY_PIPELINE };