import { z } from "zod";

import { QUESTION_STATUSES } from "@question/domain/value-objects/question-status/question-status.constants";
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";

import type { ZodArray, ZodEnum, ZodURL } from "zod";

function zQuestionCognitiveDifficulty(): ZodEnum {
  return z.enum(QUESTION_COGNITIVE_DIFFICULTIES)
    .describe("Question's cognitive difficulty level.")
    .meta({ example: QUESTION_COGNITIVE_DIFFICULTIES[2] });
}

function zQuestionStatus(): ZodEnum {
  return z.enum(QUESTION_STATUSES)
    .describe("Question's status.")
    .meta({ example: QUESTION_STATUSES[1] });
}

function zQuestionSourceUrls(): ZodArray<ZodURL> {
  return z.array(z.url())
    .min(1)
    .describe("List of source URLs for the question.")
    .meta({ example: ["https://example.com/source1", "https://example.com/source2"] });
}

export {
  zQuestionCognitiveDifficulty,
  zQuestionStatus,
  zQuestionSourceUrls,
};