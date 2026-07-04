import { z } from "zod";

import { areValuesUniqueFromStrings } from "@shared/application/dto/zod/refinements/array/array.zod.refinements";
import { normalizeToArray } from "@shared/application/dto/zod/preprocessors/array/array.zod.preprocessors";
import { zIsoDateTime, zMongoId } from "@shared/infrastructure/http/zod/validators/string/string.zod.validators";

import { QUESTION_AUTHOR_ROLES, QUESTION_CATEGORIES, QUESTION_SOURCE_URLS_MAX_ITEMS, QUESTION_SOURCE_URLS_MIN_ITEMS, QUESTION_STATUSES, QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/constants/question.constants";
import { RANDOM_QUESTIONS_EXCLUDED_IDS_MAXIMUM, RANDOM_QUESTIONS_EXCLUDED_IDS_MINIMUM } from "@question/application/dto/find-random-questions-query/constants/find-random-questions-query.dto.constants";
import type { QuestionAuthorRoleEnum, QuestionCategoryEnum, QuestionStatusEnum, QuestionCognitiveDifficultyEnum } from "@question/domain/types/question.value-objects";

import type { ZodEnum, ZodURL, ZodArray, ZodString, ZodISODateTime, ZodOptional, ZodPreprocess } from "zod";

function zQuestionAuthorRole(): ZodEnum<QuestionAuthorRoleEnum> {
  return z.enum(QUESTION_AUTHOR_ROLES)
    .describe("Question author's role");
}

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

function zQuestionExcludedIdsFilter(): ZodOptional<ZodPreprocess<ZodArray<ZodString>>> {
  return z.preprocess(
    normalizeToArray,
    z.array(zMongoId().describe("Question ID to exclude")).min(RANDOM_QUESTIONS_EXCLUDED_IDS_MINIMUM).max(RANDOM_QUESTIONS_EXCLUDED_IDS_MAXIMUM),
  )
    .refine(areValuesUniqueFromStrings, { message: "Excluded IDs must be unique" })
    .optional()
    .describe("List of question IDs to exclude from the random pool");
}

function zQuestionCategoriesFilter(): ZodOptional<ZodPreprocess<ZodArray<ZodEnum<QuestionCategoryEnum>>>> {
  return z.preprocess(
    normalizeToArray,
    z.array(z.enum(QUESTION_CATEGORIES)).min(1),
  )
    .refine(areValuesUniqueFromStrings, { message: "Categories must be unique" })
    .optional()
    .describe("List of categories to include (OR logic)");
}

function zQuestionCognitiveDifficultiesFilter(): ZodOptional<ZodPreprocess<ZodArray<ZodEnum<QuestionCognitiveDifficultyEnum>>>> {
  return z.preprocess(
    normalizeToArray,
    z.array(z.enum(QUESTION_COGNITIVE_DIFFICULTIES)).min(1),
  )
    .refine(areValuesUniqueFromStrings, { message: "Cognitive difficulties must be unique" })
    .optional()
    .describe("List of cognitive difficulties to include (OR logic)");
}

function zQuestionThemeIdsFilter(): ZodOptional<ZodPreprocess<ZodArray<ZodString>>> {
  return z.preprocess(
    normalizeToArray,
    z.array(zMongoId().describe("Theme ID to filter questions by")).min(1),
  )
    .optional()
    .describe("List of theme IDs to filter questions by (OR logic)");
}

function zQuestionId(): ZodString {
  return zMongoId()
    .describe("Question's unique identifier");
}

function zQuestionCreatedAt(): ZodISODateTime {
  return zIsoDateTime()
    .describe("Question's creation date");
}

function zQuestionUpdatedAt(): ZodISODateTime {
  return zIsoDateTime()
    .describe("Question's last update date");
}

export {
  zQuestionAuthorRole,
  zQuestionCognitiveDifficulty,
  zQuestionStatus,
  zQuestionCategory,
  zQuestionSourceUrls,
  zQuestionExcludedIdsFilter,
  zQuestionCategoriesFilter,
  zQuestionCognitiveDifficultiesFilter,
  zQuestionThemeIdsFilter,
  zQuestionId,
  zQuestionCreatedAt,
  zQuestionUpdatedAt,
};