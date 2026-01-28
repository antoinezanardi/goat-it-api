import { getCrushedDataForMongoPatchUpdate } from "@shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers";

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
    ])("$test", ({ input, expected }) => {
      const result = getCrushedDataForMongoPatchUpdate(input);

      expect(result).toStrictEqual<Record<string, unknown>>(expected);
    });
  });
});