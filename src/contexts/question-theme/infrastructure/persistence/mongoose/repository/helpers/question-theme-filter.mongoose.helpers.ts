import { QUESTION_THEME_TRANSLATION_COMPLETENESS_FIELD_SPECS } from "@question-theme/infrastructure/persistence/mongoose/constants/question-theme.mongoose.constants";

import { pickDefinedValues } from "@shared/domain/rules/object/object.rules";
import { buildIsFullyTranslatedMatchCondition } from "@shared/infrastructure/persistence/mongoose/helpers/translation-completeness.mongoose.helpers";

import type { AdminQuestionThemeFilterOptions } from "@question-theme/domain/types/question-theme.types";

function buildQuestionThemeFilterQuery(filters?: Partial<AdminQuestionThemeFilterOptions>): Record<string, unknown> {
  if (!filters) {
    return {};
  }
  const baseConditions = pickDefinedValues({ status: filters.status }) ?? {};

  if (filters.isFullyTranslated === undefined) {
    return baseConditions;
  }
  return {
    ...baseConditions,
    ...buildIsFullyTranslatedMatchCondition(QUESTION_THEME_TRANSLATION_COMPLETENESS_FIELD_SPECS, filters.isFullyTranslated),
  };
}

export { buildQuestionThemeFilterQuery };