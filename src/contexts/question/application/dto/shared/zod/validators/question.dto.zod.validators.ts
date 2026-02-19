import { z } from "zod";

import { areValuesUniqueFromStrings } from "@shared/application/dto/zod/refinements/array/array.zod.refinements";

import { QUESTION_CATEGORIES } from "@question/domain/value-objects/question-category/question-category.constants";
import { QUESTION_SOURCE_URLS_MAX_ITEMS, QUESTION_SOURCE_URLS_MIN_ITEMS } from "@question/domain/value-objects/question-source-urls/question-source-urls.constants";
import { QUESTION_STATUSES } from "@question/domain/value-objects/question-status/question-status.constants";
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";

import type { ZodEnum, ZodURL, ZodArray } from "zod";

import type { QuestionCategoryEnum } from "@question/domain/value-objects/question-category/question-category.types";
import type { QuestionStatusEnum } from "@question/domain/value-objects/question-status/question-status.types";
import type { QuestionCognitiveDifficultyEnum } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.types";

function zQuestionCognitiveDifficulty(): ZodEnum<QuestionCognitiveDifficultyEnum> {
  return z.enum(QUESTION_COGNITIVE_DIFFICULTIES)
    .describe("Question's cognitive difficulty level");
}

function zQuestionStatus(): ZodEnum<QuestionStatusEnum> {
  return z.enum(QUESTION_STATUSES)
    .describe("Question's status");
}

function zQuestionCategory(): ZodEnum<QuestionCategoryEnum> {
  return z.enum(QUESTION_CATEGORIES)
    .describe("Question's category");
}

function zQuestionSourceUrls(): ZodArray<ZodURL> {
  return z.array(z.url())
    .min(QUESTION_SOURCE_URLS_MIN_ITEMS)
    .max(QUESTION_SOURCE_URLS_MAX_ITEMS)
    .refine(areValuesUniqueFromStrings, { message: "Source URLs must be unique" })
    .describe("List of unique source URLs for the question")
    .meta({ example: ["https://example.com/source1", "https://example.com/source2"] });
}

export {
  zQuestionCognitiveDifficulty,
  zQuestionStatus,
  zQuestionCategory,
  zQuestionSourceUrls,
};