import type { FindAllOptions } from "@shared/domain/types/find/find.types";

function hasLimit(limit: FindAllOptions<string>["limit"]): limit is number {
  return limit !== undefined && limit !== 0;
}

export { hasLimit };