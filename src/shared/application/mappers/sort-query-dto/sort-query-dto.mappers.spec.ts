import { createSortOptionsFromSortQueryDto } from "@shared/application/mappers/sort-query-dto/sort-query-dto.mappers";

import type { SortOptions, SortOrder } from "@shared/domain/types/sort/sort.types";

describe(createSortOptionsFromSortQueryDto, () => {
  it.each<{ test: string; dto: { "sort-by": string; "sort-order": SortOrder }; expected: SortOptions<string> }>([
    {
      test: "should map sort-by to sortBy and sort-order to sortOrder when called.",
      dto: { "sort-by": "createdAt", "sort-order": "asc" },
      expected: { sortBy: "createdAt", sortOrder: "asc" },
    },
    {
      test: "should map desc sort order correctly when called.",
      dto: { "sort-by": "updatedAt", "sort-order": "desc" },
      expected: { sortBy: "updatedAt", sortOrder: "desc" },
    },
  ])("$test", ({ dto, expected }) => {
    const result = createSortOptionsFromSortQueryDto(dto);

    expect(result).toStrictEqual(expected);
  });
});