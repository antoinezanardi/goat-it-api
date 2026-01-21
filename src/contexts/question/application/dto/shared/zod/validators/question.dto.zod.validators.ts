import { z } from "zod";

import { areValuesUnique } from "@shared/application/dto/zod/refinements/array/array.zod.refinements";

import { QUESTION_STATUSES } from "@question/domain/value-objects/question-status/question-status.constants";
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";

import type { ZodEnum, ZodURL, ZodArray } from "zod";

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

function zQuestionSourceUrls(): ZodArray<ZodURL> {
  return z.array(z.url())
    .min(1)
    .describe("List of unique source URLs for the question")
    .meta({ example: ["https://example.com/source1", "https://example.com/source2"] })
    .refine(areValuesUnique, { message: "Source URLs must be unique" });
}

export {
  zQuestionCognitiveDifficulty,
  zQuestionStatus,
  zQuestionSourceUrls,
};