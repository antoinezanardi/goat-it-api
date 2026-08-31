import { createFindRandomQuestionsOptionsFromBodyDto } from "@question/application/mappers/find-random-options/find-random-options.mappers";

import { createFakeFindRandomQuestionsBodyDto } from "@faketories/contexts/question/dto/find-random-questions-body/find-random-questions-body.dto.faketory";

describe(createFindRandomQuestionsOptionsFromBodyDto, () => {
  it("should return find random options with the limit from body dto when called.", () => {
    const bodyDto = createFakeFindRandomQuestionsBodyDto({ limit: 5 });

    const result = createFindRandomQuestionsOptionsFromBodyDto(bodyDto);

    expect(result).toMatchObject({ limit: 5 });
  });

  it("should return find random options with a different limit when body dto has a different limit.", () => {
    const bodyDto = createFakeFindRandomQuestionsBodyDto({ limit: 10 });

    const result = createFindRandomQuestionsOptionsFromBodyDto(bodyDto);

    expect(result).toMatchObject({ limit: 10 });
  });

  it.each<{ test: string; bodyDto: ReturnType<typeof createFakeFindRandomQuestionsBodyDto>; expectedField: string; expectedValue: string[] }>([
    {
      test: "should map excludedIds when excludedIds is provided.",
      bodyDto: createFakeFindRandomQuestionsBodyDto({ excludedIds: ["60af924f4f1a2563f8e8b456"] }),
      expectedField: "excludedIds",
      expectedValue: ["60af924f4f1a2563f8e8b456"],
    },
    {
      test: "should map categories when categories is provided.",
      bodyDto: createFakeFindRandomQuestionsBodyDto({ categories: ["trivia"] }),
      expectedField: "categories",
      expectedValue: ["trivia"],
    },
    {
      test: "should map cognitiveDifficulties when cognitiveDifficulties is provided.",
      bodyDto: createFakeFindRandomQuestionsBodyDto({ cognitiveDifficulties: ["easy"] }),
      expectedField: "cognitiveDifficulties",
      expectedValue: ["easy"],
    },
    {
      test: "should map themeIds when themeIds is provided.",
      bodyDto: createFakeFindRandomQuestionsBodyDto({ themeIds: ["507f1f77bcf86cd799439011"] }),
      expectedField: "themeIds",
      expectedValue: ["507f1f77bcf86cd799439011"],
    },
  ])("$test", ({ bodyDto, expectedField, expectedValue }) => {
    const result = createFindRandomQuestionsOptionsFromBodyDto(bodyDto);

    expect(result).toHaveProperty(expectedField, expectedValue);
  });

  it("should map all filter fields when provided in body dto.", () => {
    const bodyDto = createFakeFindRandomQuestionsBodyDto({
      limit: 7,
      excludedIds: ["60af924f4f1a2563f8e8b456"],
      categories: ["trivia"],
      cognitiveDifficulties: ["easy"],
      themeIds: ["507f1f77bcf86cd799439011"],
    });

    const result = createFindRandomQuestionsOptionsFromBodyDto(bodyDto);

    expect(result).toMatchObject({
      limit: 7,
      excludedIds: ["60af924f4f1a2563f8e8b456"],
      categories: ["trivia"],
      cognitiveDifficulties: ["easy"],
      themeIds: ["507f1f77bcf86cd799439011"],
    });
  });

  it.each<{ test: string; field: "excludedIds" | "categories" | "cognitiveDifficulties" | "themeIds" }>([
    {
      test: "should keep excludedIds undefined when excludedIds is omitted.",
      field: "excludedIds" as const,
    },
    {
      test: "should keep categories undefined when categories is omitted.",
      field: "categories" as const,
    },
    {
      test: "should keep cognitiveDifficulties undefined when cognitiveDifficulties is omitted.",
      field: "cognitiveDifficulties" as const,
    },
    {
      test: "should keep themeIds undefined when themeIds is omitted.",
      field: "themeIds" as const,
    },
  ])("$test", ({ field }) => {
    const bodyDto = createFakeFindRandomQuestionsBodyDto({ [field]: undefined });

    const result = createFindRandomQuestionsOptionsFromBodyDto(bodyDto);

    expect(result[field]).toBeUndefined();
  });
});