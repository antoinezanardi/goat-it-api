import { Types } from "mongoose";

import { buildIsFullyTranslatedMatchCondition } from "@shared/infrastructure/persistence/mongoose/helpers/translation-completeness.mongoose.helpers";

import { QUESTION_TRANSLATION_COMPLETENESS_FIELD_SPECS } from "@question/infrastructure/persistence/mongoose/constants/question.mongoose.constants";

import type { PipelineStage } from "mongoose";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";
import type { QuestionFilterOptions } from "@question/domain/types/question.types";

function buildIsApplicableForLocaleMatchCondition(locale: Locale): Record<string, unknown> {
  return {
    $or: [
      { applicableLocales: { $exists: false } },
      { applicableLocales: { $size: 0 } },
      { applicableLocales: locale },
    ],
  };
}

// Acceptable as locale filter wiring adds 3 lines; function was already at the 30-line cap
// oxlint-disable-next-line eslint/max-lines-per-function
function buildQuestionAggregationFilterStages(filters?: Partial<QuestionFilterOptions>): PipelineStage[] {
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
  if (filters.isFullyTranslated !== undefined) {
    Object.assign(matchConditions, buildIsFullyTranslatedMatchCondition(QUESTION_TRANSLATION_COMPLETENESS_FIELD_SPECS, filters.isFullyTranslated, "$applicableLocales"));
  }
  if (filters.locale !== undefined) {
    Object.assign(matchConditions, buildIsApplicableForLocaleMatchCondition(filters.locale));
  }

  if (Object.keys(matchConditions).length === 0) {
    return [];
  }
  return [{ $match: matchConditions }];
}

export { buildIsApplicableForLocaleMatchCondition, buildQuestionAggregationFilterStages };