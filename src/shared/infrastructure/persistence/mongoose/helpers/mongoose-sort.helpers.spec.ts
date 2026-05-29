import { getMongoSortDirectionFromSortOrder } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose-sort.helpers";
import type { MongoSortDirection } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose-sort.helpers";

import type { SortOrder } from "@shared/domain/types/sort/sort.types";

describe("Mongoose Sort Helpers", () => {
  describe(getMongoSortDirectionFromSortOrder, () => {
    it.each<{ sortOrder: SortOrder; expected: MongoSortDirection }>([
      { sortOrder: "asc", expected: 1 },
      { sortOrder: "desc", expected: -1 },
    ])("should return $expected when sort order is $sortOrder.", ({ sortOrder, expected }) => {
      const result = getMongoSortDirectionFromSortOrder(sortOrder);

      expect(result).toBe(expected);
    });
  });
});