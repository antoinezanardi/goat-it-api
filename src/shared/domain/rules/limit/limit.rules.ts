import type { FindAllOptions } from "@shared/domain/types/find/find.types";

/**
 * Tells whether a find-all query is bounded: `undefined` and `0` both mean "return everything".
 */
function hasLimit(limit: FindAllOptions<string>["limit"]): limit is number {
  return limit !== undefined && limit !== 0;
}

export { hasLimit };