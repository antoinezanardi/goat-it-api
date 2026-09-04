import { Types } from "mongoose";
import { shake } from "radashi";

import { addArrayFilterIfNonEmpty } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";
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

function buildQuestionAggregationFilterStages(filters?: Partial<QuestionFilterOptions>): PipelineStage[] {
  if (!filters) {
    return [];
  }

  const matchConditions: Record<string, unknown> = shake({
    "status": filters.status,
    "category": filters.category,
    "cognitiveDifficulty": filters.cognitiveDifficulty,
    "author.role": filters.authorRole,
  });

  addArrayFilterIfNonEmpty(filters.themeIds, matchConditions, "themes.themeId", ids => ({ $in: ids.map(id => new Types.ObjectId(id)) }));

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