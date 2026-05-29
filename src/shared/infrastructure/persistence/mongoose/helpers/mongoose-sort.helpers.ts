import type { SortOrder } from "@shared/domain/types/sort/sort.types";

type MongoSortDirection = 1 | -1;

function getMongoSortDirectionFromSortOrder(sortOrder: SortOrder): MongoSortDirection {
  return sortOrder === "asc" ? 1 : -1;
}

export { getMongoSortDirectionFromSortOrder };

export type { MongoSortDirection };