import { ZodError } from "zod";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import { SORT_ORDER_DEFAULT, SORT_ORDER_DESCRIPTION } from "@shared/infrastructure/http/zod/validators/sort/constants/sort.zod.validators.constants";

import { ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO } from "@question/modules/question-theme/application/dto/admin-find-question-themes-sort-query/admin-find-question-themes-sort-query.dto.shape";
import { ADMIN_QUESTION_THEME_SORTABLE_FIELDS } from "@question/modules/question-theme/domain/constants/question-theme-sortable-fields.constants";
import { QUESTION_THEME_SORT_BY_DEFAULT, QUESTION_THEME_SORT_BY_DESCRIPTION } from "@question/modules/question-theme/application/dto/zod/validators/constants/question-theme-sort.dto.zod.validators.constants";
import type { AdminFindQuestionThemesSortQueryDto } from "@question/modules/question-theme/application/dto/admin-find-question-themes-sort-query/admin-find-question-themes-sort-query.dto.shape";

import { createFakeAdminFindQuestionThemesSortQueryDto } from "@faketories/contexts/question/question-theme/dto/admin-find-question-themes-sort-query/admin-find-question-themes-sort-query.dto.faketory";

describe("Admin Find Question-Themes Sort Query DTO Shape", () => {
  let validDto: AdminFindQuestionThemesSortQueryDto;

  beforeEach(() => {
    validDto = createFakeAdminFindQuestionThemesSortQueryDto();
  });

  it("should pass validation when a valid dto is provided.", () => {
    expect(() => ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(validDto)).not.toThrow();
  });

  describe("sort-by", () => {
    it.each(ADMIN_QUESTION_THEME_SORTABLE_FIELDS)("should pass validation when sort-by is '%s'.", sortBy => {
      const dto = createFakeAdminFindQuestionThemesSortQueryDto({ "sort-by": sortBy });

      expect(() => ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when sort-by is invalid.", () => {
      const dtoWithInvalidSortBy = { ...validDto, "sort-by": "invalid" };

      expect(() => ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dtoWithInvalidSortBy)).toThrow(ZodError);
    });

    it("should throw zod error when sort-by is 'cognitiveDifficulty' which is not a question-theme field.", () => {
      const dtoWithInvalidField = { ...validDto, "sort-by": "cognitiveDifficulty" };

      expect(() => ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dtoWithInvalidField)).toThrow(ZodError);
    });

    it("should use default value 'createdAt' when sort-by is not provided.", () => {
      const dtoWithoutSortBy = { "sort-order": "asc" };

      const result = ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dtoWithoutSortBy);

      expect(result["sort-by"]).toBe("createdAt");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO.shape["sort-by"].meta();
      const expectedMetadata = { description: QUESTION_THEME_SORT_BY_DESCRIPTION, example: QUESTION_THEME_SORT_BY_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("sort-order", () => {
    it.each(SORT_ORDERS)("should pass validation when sort-order is '%s'.", sortOrder => {
      const dto = createFakeAdminFindQuestionThemesSortQueryDto({ "sort-order": sortOrder });

      expect(() => ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when sort-order is invalid.", () => {
      const dtoWithInvalidSortOrder = { ...validDto, "sort-order": "invalid" };

      expect(() => ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dtoWithInvalidSortOrder)).toThrow(ZodError);
    });

    it("should use default value 'desc' when sort-order is not provided.", () => {
      const dtoWithoutSortOrder = { "sort-by": "createdAt" };

      const result = ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dtoWithoutSortOrder);

      expect(result["sort-order"]).toBe("desc");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO.shape["sort-order"].meta();
      const expectedMetadata = { description: SORT_ORDER_DESCRIPTION, example: SORT_ORDER_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  it("should use both defaults when no fields are provided.", () => {
    const result = ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse({});

    expect(result).toStrictEqual<AdminFindQuestionThemesSortQueryDto>({ "sort-by": "createdAt", "sort-order": "desc" });
  });
});