import { createFindRandomQuestionsOptionsFromQueryDto } from "@question/application/mappers/find-random-options/find-random-options.mappers";

import { createFakeFindRandomQuestionsQueryDto } from "@faketories/contexts/question/dto/find-random-questions-query/find-random-questions-query.dto.faketory";

describe("Find Random Options Mappers", () => {
  describe(createFindRandomQuestionsOptionsFromQueryDto, () => {
    it("should return find random options with the limit from query dto when called.", () => {
      const queryDto = createFakeFindRandomQuestionsQueryDto({ limit: 5 });

      const result = createFindRandomQuestionsOptionsFromQueryDto(queryDto);

      expect(result).toMatchObject({ limit: 5 });
    });

    it("should return find random options with a different limit when query dto has a different limit.", () => {
      const queryDto = createFakeFindRandomQuestionsQueryDto({ limit: 10 });

      const result = createFindRandomQuestionsOptionsFromQueryDto(queryDto);

      expect(result).toMatchObject({ limit: 10 });
    });

    it.each([
      {
        test: "should map excludedIds when excluded-ids is provided.",
        queryDto: createFakeFindRandomQuestionsQueryDto({ "excluded-ids": ["60af924f4f1a2563f8e8b456"] }),
        expectedField: "excludedIds",
        expectedValue: ["60af924f4f1a2563f8e8b456"],
      },
      {
        test: "should map categories when categories is provided.",
        queryDto: createFakeFindRandomQuestionsQueryDto({ categories: ["trivia"] }),
        expectedField: "categories",
        expectedValue: ["trivia"],
      },
      {
        test: "should map cognitiveDifficulties when cognitive-difficulties is provided.",
        queryDto: createFakeFindRandomQuestionsQueryDto({ "cognitive-difficulties": ["easy"] }),
        expectedField: "cognitiveDifficulties",
        expectedValue: ["easy"],
      },
      {
        test: "should map themeIds when theme-ids is provided.",
        queryDto: createFakeFindRandomQuestionsQueryDto({ "theme-ids": ["507f1f77bcf86cd799439011"] }),
        expectedField: "themeIds",
        expectedValue: ["507f1f77bcf86cd799439011"],
      },
    ])("$test", ({ queryDto, expectedField, expectedValue }) => {
      const result = createFindRandomQuestionsOptionsFromQueryDto(queryDto);

      expect(result).toHaveProperty(expectedField, expectedValue);
    });

    it("should map all filter fields when provided in query dto.", () => {
      const queryDto = createFakeFindRandomQuestionsQueryDto({
        "limit": 7,
        "excluded-ids": ["60af924f4f1a2563f8e8b456"],
        "categories": ["trivia"],
        "cognitive-difficulties": ["easy"],
        "theme-ids": ["507f1f77bcf86cd799439011"],
      });

      const result = createFindRandomQuestionsOptionsFromQueryDto(queryDto);

      expect(result).toMatchObject({
        limit: 7,
        excludedIds: ["60af924f4f1a2563f8e8b456"],
        categories: ["trivia"],
        cognitiveDifficulties: ["easy"],
        themeIds: ["507f1f77bcf86cd799439011"],
      });
    });

    it.each([
      {
        test: "should keep excludedIds undefined when all filter fields are omitted.",
        queryKey: "excluded-ids",
        field: "excludedIds" as const,
      },
      {
        test: "should keep categories undefined when all filter fields are omitted.",
        queryKey: "categories",
        field: "categories" as const,
      },
      {
        test: "should keep cognitiveDifficulties undefined when all filter fields are omitted.",
        queryKey: "cognitive-difficulties",
        field: "cognitiveDifficulties" as const,
      },
      {
        test: "should keep themeIds undefined when all filter fields are omitted.",
        queryKey: "theme-ids",
        field: "themeIds" as const,
      },
    ])("$test", ({ queryKey, field }) => {
      const queryDto = createFakeFindRandomQuestionsQueryDto({ [queryKey]: undefined });

      const result = createFindRandomQuestionsOptionsFromQueryDto(queryDto);

      expect(result[field]).toBeUndefined();
    });
  });
});