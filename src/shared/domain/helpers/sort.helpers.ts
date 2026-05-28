import type { SortDirection, SortOrder } from "@shared/domain/types/sort.types";

function getSortDirectionFromSortOrder(sortOrder: SortOrder): SortDirection {
  return sortOrder === "asc" ? 1 : -1;
}

export { getSortDirectionFromSortOrder };