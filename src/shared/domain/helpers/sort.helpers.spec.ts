import { getSortDirectionFromSortOrder } from "@shared/domain/helpers/sort.helpers";

describe("Sort Helpers", () => {
  describe(getSortDirectionFromSortOrder, () => {
    it("should return 1 when sort order is asc.", () => {
      const result = getSortDirectionFromSortOrder("asc");

      expect(result).toBe(1);
    });

    it("should return -1 when sort order is desc.", () => {
      const result = getSortDirectionFromSortOrder("desc");

      expect(result).toBe(-1);
    });
  });
});