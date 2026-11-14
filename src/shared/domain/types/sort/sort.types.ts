import type { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";

import type { TupleToUnion } from "type-fest";

/**
 * The accepted sort directions, derived from the `SORT_ORDERS` tuple so widening that constant widens this union.
 */
type SortOrder = TupleToUnion<typeof SORT_ORDERS>;

/**
 * Pairs the field to sort on with its direction, as forwarded from the query DTO down to the repositories.
 */
type SortOptions<T extends string> = {
  sortBy: T;
  sortOrder: SortOrder;
};

export type { SortOrder, SortOptions };