import { pickDefinedValues } from "@shared/domain/rules/object/object.rules";

import type { AdminQuestionThemeFilterOptions } from "@question-theme/domain/types/question-theme.types";

function buildQuestionThemeFilterQuery(filters?: Partial<AdminQuestionThemeFilterOptions>): Record<string, unknown> {
  if (!filters) {
    return {};
  }
  return pickDefinedValues({ status: filters.status }) ?? {};
}

export { buildQuestionThemeFilterQuery };