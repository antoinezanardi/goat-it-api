import { buildMongooseAggregationSortStages, getCrushedDataForMongoPatchUpdate, getDefinedFieldsForMongoArrayElementUpdate, getMongoSortDirectionFromSortOrder } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";
import type { MongoSortDirection } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";

import type { SortOptions, SortOrder } from "@shared/domain/types/sort/sort.types";

describe("Mongoose Helpers", () => {
  describe(getCrushedDataForMongoPatchUpdate, () => {
    it.each<{
      test: string;
      input: Record<string, unknown>;
      expected: Record<string, unknown>;
    }>([
      {
        test: "should flatten nested objects when called.",
        input: {
          name: "Sample Name",
          details: {
            age: 30,
            address: {
              street: "123 Main St",
              city: "Anytown",
            },
          },
        },
        expected: {
          "name": "Sample Name",
          "details.age": 30,
          "details.address.street": "123 Main St",
          "details.address.city": "Anytown",
        },
      },
      {
        test: "should not flatten array items when called.",
        input: {
          name: "Sample Name",
          tags: ["tag1", "tag2", "tag3"],
          attributes: {
            colors: ["red", "blue"],
            sizes: ["S", "M", "L"],
          },
        },
        expected: {
          "name": "Sample Name",
          "tags": ["tag1", "tag2", "tag3"],
          "attributes.colors": ["red", "blue"],
          "attributes.sizes": ["S", "M", "L"],
        },
      },
      {
        test: "should handle empty objects and arrays correctly when called.",
        input: {
          emptyObject: {},
          emptyArray: [],
          nested: {
            emptyObj: {},
            emptyArr: [],
          },
        },
        expected: {
          "emptyObject": {},
          "emptyArray": [],
          "nested.emptyObj": {},
          "nested.emptyArr": [],
        },
      },
      {
        test: "should return an empty object when given an empty object when called.",
        input: {},
        expected: {},
      },
      {
        test: "should handle nested empty objects correctly when called.",
        input: {
          level1: {
            level2: {
              level3: {},
            },
          },
        },
        expected: {
          "level1.level2.level3": {},
        },
      },
      {
        test: "should handle nested arrays in objects correctly when called.",
        input: {
          level1: {
            level2: [
              { item1: "value1" },
              { item2: "value2" },
            ],
          },
        },
        expected: {
          "level1.level2": [
            { item1: "value1" },
            { item2: "value2" },
          ],
        },
      },
      {
        test: "should preserve null values when called.",
        input: {
          name: "Sample",
          deletedAt: null,
          nested: {
            value: null,
          },
        },
        expected: {
          "name": "Sample",
          "deletedAt": null,
          "nested.value": null,
        },
      },
      {
        test: "should preserve Date objects when called.",
        input: {
          createdAt: new Date("2024-01-01"),
          meta: {
            updatedAt: new Date("2024-01-02"),
          },
        },
        expected: {
          "createdAt": new Date("2024-01-01"),
          "meta.updatedAt": new Date("2024-01-02"),
        },
      },
    ])("$test", ({ input, expected }) => {
      const result = getCrushedDataForMongoPatchUpdate(input);

      expect(result).toStrictEqual(expected);
    });
  });

  describe(getDefinedFieldsForMongoArrayElementUpdate, () => {
    it.each<{
      test: string;
      data: Record<string, unknown>;
      arrayPath: string;
      expected: Record<string, unknown>;
    }>([
      {
        test: "should prefix all defined keys with array path when all fields are defined.",
        data: { isPrimary: true, isHint: false },
        arrayPath: "themes.$[elem]",
        expected: {
          "themes.$[elem].isPrimary": true,
          "themes.$[elem].isHint": false,
        },
      },
      {
        test: "should strip undefined values and prefix remaining keys when some fields are undefined.",
        data: { isPrimary: true, isHint: undefined },
        arrayPath: "themes.$[elem]",
        expected: {
          "themes.$[elem].isPrimary": true,
        },
      },
      {
        test: "should return an empty object when all fields are undefined.",
        data: { isPrimary: undefined, isHint: undefined },
        arrayPath: "themes.$[elem]",
        expected: {},
      },
      {
        test: "should return an empty object when given an empty object.",
        data: {},
        arrayPath: "themes.$[elem]",
        expected: {},
      },
      {
        test: "should handle a single defined field when called.",
        data: { isHint: true },
        arrayPath: "items.$[i]",
        expected: {
          "items.$[i].isHint": true,
        },
      },
    ])("$test", ({ data, arrayPath, expected }) => {
      const result = getDefinedFieldsForMongoArrayElementUpdate(data, arrayPath);

      expect(result).toStrictEqual(expected);
    });
  });

  describe(getMongoSortDirectionFromSortOrder, () => {
    it.each<{ sortOrder: SortOrder; expected: MongoSortDirection }>([
      { sortOrder: "asc", expected: 1 },
      { sortOrder: "desc", expected: -1 },
    ])("should return $expected when sort order is $sortOrder.", ({ sortOrder, expected }) => {
      const result = getMongoSortDirectionFromSortOrder(sortOrder);

      expect(result).toBe(expected);
    });
  });

  describe(buildMongooseAggregationSortStages, () => {
    describe("when sort field has no semantic order", () => {
      it("should return a simple $sort stage with ascending direction when sort order is asc.", () => {
        const sortOptions: SortOptions<"createdAt"> = { sortBy: "createdAt", sortOrder: "asc" };

        const result = buildMongooseAggregationSortStages(sortOptions);

        expect(result).toStrictEqual([{ $sort: { createdAt: 1, _id: 1 } }]);
      });

      it("should return a simple $sort stage with descending direction when sort order is desc.", () => {
        const sortOptions: SortOptions<"createdAt"> = { sortBy: "createdAt", sortOrder: "desc" };

        const result = buildMongooseAggregationSortStages(sortOptions);

        expect(result).toStrictEqual([{ $sort: { createdAt: -1, _id: -1 } }]);
      });
    });

    describe("when sort field has a semantic order", () => {
      const semanticSortOrders = {
        status: ["pending", "active", "rejected", "archived"] as const,
      };

      it("should return $addFields, $sort, and $unset stages with ascending direction when sort order is asc.", () => {
        const sortOptions: SortOptions<"status"> = { sortBy: "status", sortOrder: "asc" };

        const result = buildMongooseAggregationSortStages(sortOptions, semanticSortOrders);

        expect(result).toStrictEqual([
          { $addFields: { _sortPriority: { $indexOfArray: [["pending", "active", "rejected", "archived"], "$status"] } } },
          { $sort: { _sortPriority: 1, _id: 1 } },
          { $unset: "_sortPriority" },
        ]);
      });

      it("should return $addFields, $sort, and $unset stages with descending direction when sort order is desc.", () => {
        const sortOptions: SortOptions<"status"> = { sortBy: "status", sortOrder: "desc" };

        const result = buildMongooseAggregationSortStages(sortOptions, semanticSortOrders);

        expect(result).toStrictEqual([
          { $addFields: { _sortPriority: { $indexOfArray: [["pending", "active", "rejected", "archived"], "$status"] } } },
          { $sort: { _sortPriority: -1, _id: -1 } },
          { $unset: "_sortPriority" },
        ]);
      });

      it("should return a simple $sort stage when sort field is not in the semantic orders map.", () => {
        const sortOptions: SortOptions<"createdAt" | "status"> = { sortBy: "createdAt", sortOrder: "asc" };

        const result = buildMongooseAggregationSortStages(sortOptions, semanticSortOrders);

        expect(result).toStrictEqual([{ $sort: { createdAt: 1, _id: 1 } }]);
      });
    });
  });
});