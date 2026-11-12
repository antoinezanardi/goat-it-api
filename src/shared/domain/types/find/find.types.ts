import type { SortOptions } from "@shared/domain/types/sort/sort.types";

/**
 * Options shared by every find-all query: the sort to apply, optional filters and an optional result bound.
 */
type FindAllOptions<SortField extends string, Filters extends Record<string, unknown> = Record<string, never>> = {
  sort: SortOptions<SortField>;
  filters?: Partial<Filters>;
  /**
   * `undefined` and `0` both mean unbounded; the HTTP layer defaults it to 50 results.
   */
  limit?: number;
};

export type { FindAllOptions };