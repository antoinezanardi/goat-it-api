import { createAdminQuestionThemeFilterOptionsFromQueryDto } from "@question-theme/application/mappers/question-theme-filter-query-dto/question-theme-filter-query-dto.mappers";

import type { AdminFindQuestionThemesQueryDto } from "@question-theme/application/dto/admin-find-question-themes-query/admin-find-question-themes-query.dto.shape";

import type { AdminQuestionThemeFilterOptions } from "@question-theme/domain/types/question-theme.types";

describe("Question Theme Filter Query DTO Mappers", () => {
  describe(createAdminQuestionThemeFilterOptionsFromQueryDto, () => {
    it("should return filter options with status when status is provided.", () => {
      const dto: AdminFindQuestionThemesQueryDto = {
        "sort-by": "slug",
        "sort-order": "asc",
        "status": "active",
      };

      const result = createAdminQuestionThemeFilterOptionsFromQueryDto(dto);

      const expected: Partial<AdminQuestionThemeFilterOptions> = { status: "active" };

      expect(result).toStrictEqual(expected);
    });

    it("should return undefined when status is not provided.", () => {
      const dto: AdminFindQuestionThemesQueryDto = {
        "sort-by": "slug",
        "sort-order": "asc",
      };

      const result = createAdminQuestionThemeFilterOptionsFromQueryDto(dto);

      expect(result).toBeUndefined();
    });
  });
});