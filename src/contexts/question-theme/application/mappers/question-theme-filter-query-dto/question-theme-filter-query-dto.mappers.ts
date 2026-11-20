import { pickDefinedValues } from "@shared/domain/rules/object/object.rules";
import { FULLY_TRANSLATED_QUERY_KEY } from "@shared/application/dto/constants/translation-completeness-query.dto.constants";

import type { AdminFindQuestionThemesQueryDto } from "@question-theme/application/dto/admin-find-question-themes-query/admin-find-question-themes-query.dto.shape";

import type { AdminQuestionThemeFilterOptions } from "@question-theme/domain/types/question-theme.types";

/**
 * Maps an admin theme-list query DTO to repository filter options, dropping filters the client did not send.
 *
 * Returns `undefined` when no filter remains, which the repository reads as "match every theme".
 */
function createAdminQuestionThemeFilterOptionsFromQueryDto(dto: AdminFindQuestionThemesQueryDto): Partial<AdminQuestionThemeFilterOptions> | undefined {
  return pickDefinedValues({
    status: dto.status,
    isFullyTranslated: dto[FULLY_TRANSLATED_QUERY_KEY],
  });
}

export { createAdminQuestionThemeFilterOptionsFromQueryDto };