import { ZodError } from "zod";

import { FIND_QUESTION_THEMES_SORT_QUERY_DTO } from "@question-theme/application/dto/find-question-themes-sort-query/find-question-themes-sort-query.dto.shape";
import { QUESTION_THEME_SORTABLE_FIELDS } from "@question-theme/domain/constants/question-theme.constants";
import { QUESTION_THEME_SORT_BY_DEFAULT, QUESTION_THEME_SORT_BY_DESCRIPTION, QUESTION_THEME_SORT_ORDER_DEFAULT, QUESTION_THEME_SORT_ORDER_DESCRIPTION } from "@question-theme/application/dto/zod/validators/constants/question-theme-sort.dto.zod.validators.constants";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";

import { createFakeFindQuestionThemesSortQueryDto } from "@faketories/contexts/question-theme/dto/find-question-themes-sort-query/find-question-themes-sort-query.dto.faketory";

import type { FindQuestionThemesSortQueryDto } from "@question-theme/application/dto/find-question-themes-sort-query/find-question-themes-sort-query.dto.shape";

describe("Find Question-Themes Sort Query DTO Shape", () => {
  let validDto: FindQuestionThemesSortQueryDto;

  beforeEach(() => {
    validDto = createFakeFindQuestionThemesSortQueryDto();
  });

  it("should pass validation when a valid dto is provided.", () => {
    expect(() => FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(validDto)).not.toThrow();
  });

  describe("sort-by", () => {
    it.each(QUESTION_THEME_SORTABLE_FIELDS)("should pass validation when sort-by is '%s'.", sortBy => {
      const dto = createFakeFindQuestionThemesSortQueryDto({ "sort-by": sortBy });

      expect(() => FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when sort-by is invalid.", () => {
      const dtoWithInvalidSortBy = { ...validDto, "sort-by": "invalid" };

      expect(() => FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dtoWithInvalidSortBy)).toThrow(ZodError);
    });

    it("should throw zod error when sort-by is 'status' which is admin-only.", () => {
      const dtoWithStatusSortBy = { ...validDto, "sort-by": "status" };

      expect(() => FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dtoWithStatusSortBy)).toThrow(ZodError);
    });

    it("should use default value 'slug' when sort-by is not provided.", () => {
      const dtoWithoutSortBy = { "sort-order": "asc" };

      const result = FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dtoWithoutSortBy);

      expect(result["sort-by"]).toBe("slug");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = FIND_QUESTION_THEMES_SORT_QUERY_DTO.shape["sort-by"].meta();
      const expectedMetadata = { description: QUESTION_THEME_SORT_BY_DESCRIPTION, example: QUESTION_THEME_SORT_BY_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("sort-order", () => {
    it.each(SORT_ORDERS)("should pass validation when sort-order is '%s'.", sortOrder => {
      const dto = createFakeFindQuestionThemesSortQueryDto({ "sort-order": sortOrder });

      expect(() => FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when sort-order is invalid.", () => {
      const dtoWithInvalidSortOrder = { ...validDto, "sort-order": "invalid" };

      expect(() => FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dtoWithInvalidSortOrder)).toThrow(ZodError);
    });

    it("should use default value 'asc' when sort-order is not provided.", () => {
      const dtoWithoutSortOrder = { "sort-by": "slug" };

      const result = FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dtoWithoutSortOrder);

      expect(result["sort-order"]).toBe("asc");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = FIND_QUESTION_THEMES_SORT_QUERY_DTO.shape["sort-order"].meta();
      const expectedMetadata = { description: QUESTION_THEME_SORT_ORDER_DESCRIPTION, example: QUESTION_THEME_SORT_ORDER_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  it("should use both defaults when no fields are provided.", () => {
    const result = FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse({});

    expect(result).toStrictEqual<FindQuestionThemesSortQueryDto>({ "sort-by": "slug", "sort-order": "asc" });
  });
});