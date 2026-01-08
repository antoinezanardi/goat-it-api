import { z } from "zod";

import { QUESTION_STATUSES } from "@question/domain/value-objects/question-status/question-status.constants";
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";

import type { ZodEnum, ZodURL, ZodSet } from "zod";

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

function zQuestionSourceUrls(): ZodSet<ZodURL> {
  return z.set(z.url())
    .min(1)
    .describe("List of source URLs for the question")
    .meta({ example: ["https://example.com/source1", "https://example.com/source2"] });
}

export {
  zQuestionCognitiveDifficulty,
  zQuestionStatus,
  zQuestionSourceUrls,
};