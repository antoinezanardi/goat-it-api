import { z } from "zod";

import {
  QUESTION_AUTHOR_ROLES,
  QUESTION_CATEGORIES,
  QUESTION_COGNITIVE_DIFFICULTIES,
  QUESTION_REJECTION_TYPES,
  QUESTION_STATUSES,
} from "@question/domain/constants/question.constants";

const QUESTION_STATS_DTO = z.strictObject({
  total: z.number().int().nonnegative().describe("Total number of questions"),
  byStatus: z.record(z.enum(QUESTION_STATUSES), z.number().int().nonnegative())
    .describe("Number of questions per status"),
  byCategory: z.record(z.enum(QUESTION_CATEGORIES), z.number().int().nonnegative())
    .describe("Number of questions per category"),
  byCognitiveDifficulty: z.record(z.enum(QUESTION_COGNITIVE_DIFFICULTIES), z.number().int().nonnegative())
    .describe("Number of questions per cognitive difficulty"),
  byAuthorRole: z.record(z.enum(QUESTION_AUTHOR_ROLES), z.number().int().nonnegative())
    .describe("Number of questions per author role"),
  byRejectionType: z.record(z.enum(QUESTION_REJECTION_TYPES), z.number().int().nonnegative())
    .describe("Number of rejected questions per rejection type"),
});

type QuestionStatsDto = z.infer<typeof QUESTION_STATS_DTO>;

export { QUESTION_STATS_DTO };

export type { QuestionStatsDto };