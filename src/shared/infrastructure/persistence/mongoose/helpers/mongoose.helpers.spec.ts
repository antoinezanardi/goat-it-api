import { getCrushedDataForMongoPatchUpdate, getDefinedFieldsForMongoArrayElementUpdate } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";

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
});