import { Types } from "mongoose";

import type { PipelineStage } from "mongoose";

import type { QuestionFilterOptions } from "@question/domain/types/question.types";

function buildMongooseAggregationFilterStages(filters?: Partial<QuestionFilterOptions>): PipelineStage[] {
  if (!filters) {
    return [];
  }

  const matchConditions: Record<string, unknown> = {};

  if (filters.status !== undefined) {
    matchConditions.status = filters.status;
  }
  if (filters.category !== undefined) {
    matchConditions.category = filters.category;
  }
  if (filters.cognitiveDifficulty !== undefined) {
    matchConditions.cognitiveDifficulty = filters.cognitiveDifficulty;
  }
  if (filters.authorRole !== undefined) {
    matchConditions["author.role"] = filters.authorRole;
  }
  if (filters.themeIds !== undefined) {
    matchConditions["themes.themeId"] = { $in: filters.themeIds.map(id => new Types.ObjectId(id)) };
  }

  if (Object.keys(matchConditions).length === 0) {
    return [];
  }
  return [{ $match: matchConditions }];
}

export { buildMongooseAggregationFilterStages };