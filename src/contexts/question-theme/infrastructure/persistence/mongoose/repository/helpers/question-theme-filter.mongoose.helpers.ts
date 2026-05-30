import type { AdminQuestionThemeFilterOptions } from "@question-theme/domain/types/question-theme.types";

function buildQuestionThemeFilterQuery(filters?: Partial<AdminQuestionThemeFilterOptions>): Record<string, unknown> {
  if (!filters) {
    return {};
  }

  const query: Record<string, unknown> = {};

  if (filters.status !== undefined) {
    query.status = filters.status;
  }
  return query;
}

export { buildQuestionThemeFilterQuery };