import { ZodError } from "zod";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import { SORT_ORDER_DEFAULT, SORT_ORDER_DESCRIPTION } from "@shared/infrastructure/http/zod/validators/sort/constants/sort.zod.validators.constants";

import { FIND_QUESTION_THEMES_SORT_QUERY_DTO } from "@question/modules/question-theme/application/dto/find-question-themes-sort-query/find-question-themes-sort-query.dto.shape";
import { QUESTION_THEME_SORTABLE_FIELDS } from "@question/modules/question-theme/domain/constants/question-theme-sortable-fields.constants";
import { QUESTION_THEME_SORT_BY_DEFAULT, QUESTION_THEME_SORT_BY_DESCRIPTION } from "@question/modules/question-theme/application/dto/zod/validators/constants/question-theme-sort.dto.zod.validators.constants";
import type { FindQuestionThemesSortQueryDto } from "@question/modules/question-theme/application/dto/find-question-themes-sort-query/find-question-themes-sort-query.dto.shape";

import { createFakeFindQuestionThemesSortQueryDto } from "@faketories/contexts/question/question-theme/dto/find-question-themes-sort-query/find-question-themes-sort-query.dto.faketory";

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

    it("should use default value 'createdAt' when sort-by is not provided.", () => {
      const dtoWithoutSortBy = { "sort-order": "asc" };

      const result = FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dtoWithoutSortBy);

      expect(result["sort-by"]).toBe("createdAt");
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

    it("should use default value 'desc' when sort-order is not provided.", () => {
      const dtoWithoutSortOrder = { "sort-by": "createdAt" };

      const result = FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse(dtoWithoutSortOrder);

      expect(result["sort-order"]).toBe("desc");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = FIND_QUESTION_THEMES_SORT_QUERY_DTO.shape["sort-order"].meta();
      const expectedMetadata = { description: SORT_ORDER_DESCRIPTION, example: SORT_ORDER_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  it("should use both defaults when no fields are provided.", () => {
    const result = FIND_QUESTION_THEMES_SORT_QUERY_DTO.parse({});

    expect(result).toStrictEqual<FindQuestionThemesSortQueryDto>({ "sort-by": "createdAt", "sort-order": "desc" });
  });
});