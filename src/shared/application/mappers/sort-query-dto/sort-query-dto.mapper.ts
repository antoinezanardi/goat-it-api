import type { SortOptions, SortOrder } from "@shared/domain/types/sort.types";

function createSortOptionsFromSortQueryDto<T extends string>(dto: { "sort-by": T; "sort-order": SortOrder }): SortOptions<T> {
  return {
    sortBy: dto["sort-by"],
    sortOrder: dto["sort-order"],
  };
}

export { createSortOptionsFromSortQueryDto };