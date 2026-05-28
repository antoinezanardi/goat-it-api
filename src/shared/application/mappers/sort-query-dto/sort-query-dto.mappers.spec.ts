import { createSortOptionsFromSortQueryDto } from "@shared/application/mappers/sort-query-dto/sort-query-dto.mappers";

import type { SortOptions } from "@shared/domain/types/sort.types";

describe("Sort Query DTO Mapper", () => {
  describe(createSortOptionsFromSortQueryDto, () => {
    it("should map sort-by to sortBy and sort-order to sortOrder when called.", () => {
      const dto = { "sort-by": "createdAt" as const, "sort-order": "asc" as const };

      const result = createSortOptionsFromSortQueryDto(dto);

      const expected: SortOptions<"createdAt"> = { sortBy: "createdAt", sortOrder: "asc" };

      expect(result).toStrictEqual(expected);
    });

    it("should map desc sort order correctly when called.", () => {
      const dto = { "sort-by": "updatedAt" as const, "sort-order": "desc" as const };

      const result = createSortOptionsFromSortQueryDto(dto);

      const expected: SortOptions<"updatedAt"> = { sortBy: "updatedAt", sortOrder: "desc" };

      expect(result).toStrictEqual(expected);
    });
  });
});