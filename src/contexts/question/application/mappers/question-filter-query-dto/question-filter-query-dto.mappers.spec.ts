import { createPublicQuestionFilterOptionsFromQueryDto, createQuestionFilterOptionsFromQueryDto } from "@question/application/mappers/question-filter-query-dto/question-filter-query-dto.mappers";
import type { AdminFindQuestionsQueryDto } from "@question/application/dto/admin-find-questions-query/admin-find-questions-query.dto.shape";

import { createFakeAdminFindQuestionsQueryDto } from "@faketories/contexts/question/dto/admin-find-questions-query/admin-find-questions-query.dto.faketory";
import { createFakeFindQuestionsQueryDto } from "@faketories/contexts/question/dto/find-questions-query/find-questions-query.dto.faketory";

import type { PublicQuestionFilterOptions, QuestionFilterOptions } from "@question/domain/types/question.types";

describe(createQuestionFilterOptionsFromQueryDto, () => {
  it("should return all filter options when all filter fields are provided.", () => {
    const dto = {
      ...createFakeAdminFindQuestionsQueryDto({
        "status": "active",
        "category": "trivia",
        "cognitive-difficulty": "hard",
        "author-role": "admin",
        "theme-ids": ["507f1f77bcf86cd799439011"],
      }),
      "is-fully-translated": true,
    } as unknown as AdminFindQuestionsQueryDto;

    const result = createQuestionFilterOptionsFromQueryDto(dto);

    const expected: Partial<QuestionFilterOptions> = {
      status: "active",
      category: "trivia",
      cognitiveDifficulty: "hard",
      authorRole: "admin",
      themeIds: ["507f1f77bcf86cd799439011"],
      isFullyTranslated: true,
    };

    expect(result).toStrictEqual(expected);
  });

  it("should return only defined filter options when some filter fields are provided.", () => {
    const dto = createFakeAdminFindQuestionsQueryDto({
      "status": "pending",
      "category": undefined,
      "cognitive-difficulty": undefined,
      "author-role": undefined,
      "theme-ids": undefined,
      "is-fully-translated": undefined,
    });

    const result = createQuestionFilterOptionsFromQueryDto(dto);

    const expected: Partial<QuestionFilterOptions> = { status: "pending" };

    expect(result).toStrictEqual(expected);
  });

  it("should return undefined when no filter fields are provided.", () => {
    const dto = createFakeAdminFindQuestionsQueryDto({
      "status": undefined,
      "category": undefined,
      "cognitive-difficulty": undefined,
      "author-role": undefined,
      "theme-ids": undefined,
      "is-fully-translated": undefined,
    });

    const result = createQuestionFilterOptionsFromQueryDto(dto);

    expect(result).toBeUndefined();
  });
});

describe(createPublicQuestionFilterOptionsFromQueryDto, () => {
  it("should return all public filter options and locale when all filter fields are provided.", () => {
    const locale = "fr";
    const dto = createFakeFindQuestionsQueryDto({
      "category": "lexicon",
      "cognitive-difficulty": "easy",
      "author-role": "game",
      "theme-ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
    });

    const result = createPublicQuestionFilterOptionsFromQueryDto(dto, locale);

    const expected: Partial<PublicQuestionFilterOptions> = {
      category: "lexicon",
      cognitiveDifficulty: "easy",
      authorRole: "game",
      themeIds: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
      locale: "fr",
    };

    expect(result).toStrictEqual(expected);
  });

  it("should return only defined filter options and locale when some filter fields are provided.", () => {
    const locale = "fr";
    const dto = createFakeFindQuestionsQueryDto({
      "category": "riddle",
      "cognitive-difficulty": undefined,
      "author-role": undefined,
      "theme-ids": undefined,
    });

    const result = createPublicQuestionFilterOptionsFromQueryDto(dto, locale);

    const expected: Partial<PublicQuestionFilterOptions> = { category: "riddle", locale: "fr" };

    expect(result).toStrictEqual(expected);
  });

  it("should return only locale when no other filter fields are provided.", () => {
    const locale = "fr";
    const dto = createFakeFindQuestionsQueryDto({
      "category": undefined,
      "cognitive-difficulty": undefined,
      "author-role": undefined,
      "theme-ids": undefined,
    });

    const result = createPublicQuestionFilterOptionsFromQueryDto(dto, locale);

    expect(result).toStrictEqual({ locale: "fr" });
  });

  it("should not include isFullyTranslated when the source dto contains it since public mapper omits it.", () => {
    const locale = "fr";
    const dto = createFakeFindQuestionsQueryDto({
      "category": "trivia",
      "cognitive-difficulty": "easy",
      "author-role": "game",
      "theme-ids": ["507f1f77bcf86cd799439011"],
    });

    const result = createPublicQuestionFilterOptionsFromQueryDto(dto, locale);

    expect(result).not.toHaveProperty("isFullyTranslated");
  });

  it("should include the provided locale in the returned options when the locale is provided.", () => {
    const locale = "it";
    const dto = createFakeFindQuestionsQueryDto();

    const result = createPublicQuestionFilterOptionsFromQueryDto(dto, locale);

    expect(result).toMatchObject({ locale: "it" });
  });
});