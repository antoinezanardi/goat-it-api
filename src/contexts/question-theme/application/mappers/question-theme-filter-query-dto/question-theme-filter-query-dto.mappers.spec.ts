import { createAdminQuestionThemeFilterOptionsFromQueryDto } from "@question-theme/application/mappers/question-theme-filter-query-dto/question-theme-filter-query-dto.mappers";

import { createFakeAdminFindQuestionThemesQueryDto } from "@faketories/contexts/question-theme/dto/admin-find-question-themes-query/admin-find-question-themes-query.dto.faketory";

import type { AdminQuestionThemeFilterOptions } from "@question-theme/domain/types/question-theme.types";

describe(createAdminQuestionThemeFilterOptionsFromQueryDto, () => {
  it("should return filter options with status when status is provided.", () => {
    const dto = createFakeAdminFindQuestionThemesQueryDto({ "status": "active", "is-fully-translated": undefined });

    const result = createAdminQuestionThemeFilterOptionsFromQueryDto(dto);

    const expected: Partial<AdminQuestionThemeFilterOptions> = { status: "active" };

    expect(result).toStrictEqual(expected);
  });

  it("should return filter options with isFullyTranslated when is-fully-translated is provided.", () => {
    const dto = { ...createFakeAdminFindQuestionThemesQueryDto({ status: undefined }), "is-fully-translated": false };

    const result = createAdminQuestionThemeFilterOptionsFromQueryDto(dto);

    const expected: Partial<AdminQuestionThemeFilterOptions> = { isFullyTranslated: false };

    expect(result).toStrictEqual(expected);
  });

  it("should return all filter options when all filter fields are provided.", () => {
    const dto = { ...createFakeAdminFindQuestionThemesQueryDto({ status: "active" }), "is-fully-translated": true };

    const result = createAdminQuestionThemeFilterOptionsFromQueryDto(dto);

    const expected: Partial<AdminQuestionThemeFilterOptions> = { status: "active", isFullyTranslated: true };

    expect(result).toStrictEqual(expected);
  });

  it("should return undefined when status and is-fully-translated are not provided.", () => {
    const dto = createFakeAdminFindQuestionThemesQueryDto({ "status": undefined, "is-fully-translated": undefined });

    const result = createAdminQuestionThemeFilterOptionsFromQueryDto(dto);

    expect(result).toBeUndefined();
  });
});