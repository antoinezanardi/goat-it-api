import { z } from "zod";

import { zLocalizedText, zLocalizedTexts } from "@shared/infrastructure/http/zod/validators/localization/localization.zod.validators";

import {
  QUESTION_ANSWER_EXAMPLE,
  QUESTION_CONTEXT_EXAMPLE,
  QUESTION_STATEMENT_EXAMPLE,
  QUESTION_TRIVIA_EXAMPLE,
} from "@question/application/dto/shared/zod/validators/question-content/constants/question-content.zod.validators.constants";

import type { ZodArray, ZodObject, ZodOptional, ZodString } from "zod";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

function zQuestionStatement(): ZodString {
  return z.string()
    .describe("Question's statement")
    .meta({ example: QUESTION_STATEMENT_EXAMPLE });
}

function zQuestionLocalizedStatement(): ZodObject<Record<Locale, ZodOptional<ZodString>>> {
  return zLocalizedText()
    .describe("Question's statement");
}

function zQuestionAnswer(): ZodString {
  return z.string()
    .describe("Question's answer")
    .meta({ example: QUESTION_ANSWER_EXAMPLE });
}

function zQuestionLocalizedAnswer(): ZodObject<Record<Locale, ZodOptional<ZodString>>> {
  return zLocalizedText()
    .describe("Question's answer");
}

function zQuestionContext(): ZodString {
  return z.string()
    .describe("Additional context for the question")
    .meta({ example: QUESTION_CONTEXT_EXAMPLE });
}

function zQuestionLocalizedContext(): ZodObject<Record<Locale, ZodOptional<ZodString>>> {
  return zLocalizedText()
    .describe("Additional context for the question");
}

function zQuestionTrivia(): ZodArray<ZodString> {
  return z.array(z.string())
    .describe("Interesting trivia related to the question")
    .meta({ example: QUESTION_TRIVIA_EXAMPLE });
}

function zQuestionLocalizedTrivia(): ZodObject<Record<Locale, ZodOptional<ZodArray<ZodString>>>> {
  return zLocalizedTexts()
    .describe("Interesting trivia related to the question");
}

export {
  zQuestionStatement,
  zQuestionLocalizedStatement,
  zQuestionAnswer,
  zQuestionLocalizedAnswer,
  zQuestionContext,
  zQuestionLocalizedContext,
  zQuestionTrivia,
  zQuestionLocalizedTrivia,
};