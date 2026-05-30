import { pickDefinedValues } from "@shared/domain/rules/object/object.rules";

import type { AdminFindQuestionThemesQueryDto } from "@question-theme/application/dto/admin-find-question-themes-query/admin-find-question-themes-query.dto.shape";

import type { AdminQuestionThemeFilterOptions } from "@question-theme/domain/types/question-theme.types";

function createAdminQuestionThemeFilterOptionsFromQueryDto(dto: AdminFindQuestionThemesQueryDto): Partial<AdminQuestionThemeFilterOptions> | undefined {
  return pickDefinedValues({
    status: dto.status,
  });
}

export { createAdminQuestionThemeFilterOptionsFromQueryDto };