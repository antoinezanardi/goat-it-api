import { z } from "zod";

import { zLocalizedText, zLocalizedTexts } from "@shared/infrastructure/http/zod/validators/localization/localization.zod.validators";
import { zHexColor, zIsoDateTime, zMongoId, zSlug } from "@shared/infrastructure/http/zod/validators/string/string.zod.validators";

import {
  QUESTION_THEME_ALIASES_EXAMPLE,
  QUESTION_THEME_DESCRIPTION_EXAMPLE,
  QUESTION_THEME_LABEL_EXAMPLE,
  QUESTION_THEME_SLUG_EXAMPLE,
} from "@question/modules/question-theme/application/dto/zod/validators/constants/question-theme.zod.validators.constants";
import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

import type { ZodArray, ZodEnum, ZodISODateTime, ZodObject, ZodOptional, ZodString } from "zod";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";
import type { QuestionThemeStatusEnum } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.types";

function zQuestionThemeId(): ZodString {
  return zMongoId()
    .describe("Question Theme's unique identifier");
}

function zQuestionThemeSlug(): ZodString {
  return zSlug()
    .describe("Question Theme's unique slug in kebab-case")
    .meta({ example: QUESTION_THEME_SLUG_EXAMPLE });
}

function zQuestionThemeLabel(): ZodString {
  return z.string()
    .describe("Question Theme's label")
    .meta({ example: QUESTION_THEME_LABEL_EXAMPLE });
}

function zQuestionThemeLocalizedLabel(): ZodObject<Record<Locale, ZodOptional<ZodString>>> {
  return zLocalizedText()
    .describe("Question Theme's label");
}

function zQuestionThemeAliases(): ZodArray<ZodString> {
  return z.array(z.string())
    .describe("Question Theme's aliases")
    .meta({ example: QUESTION_THEME_ALIASES_EXAMPLE });
}

function zQuestionThemeLocalizedAliases(): ZodObject<Record<Locale, ZodOptional<ZodArray<ZodString>>>> {
  return zLocalizedTexts()
    .describe("Question Theme's aliases");
}

function zQuestionThemeDescription(): ZodString {
  return z.string()
    .describe("Question Theme's description")
    .meta({ example: QUESTION_THEME_DESCRIPTION_EXAMPLE });
}

function zQuestionThemeLocalizedDescription(): ZodObject<Record<Locale, ZodOptional<ZodString>>> {
  return zLocalizedText()
    .describe("Question Theme's description");
}

function zQuestionThemeColor(): ZodString {
  return zHexColor()
    .describe("Question Theme's hex color");
}

function zQuestionThemeStatus(): ZodEnum<QuestionThemeStatusEnum> {
  return z.enum(QUESTION_THEME_STATUSES)
    .describe("Question Theme's status")
    .meta({ example: QUESTION_THEME_STATUSES[0] });
}

function zQuestionThemeCreatedAt(): ZodISODateTime {
  return zIsoDateTime()
    .describe("Question Theme's creation date");
}

function zQuestionThemeUpdatedAt(): ZodISODateTime {
  return zIsoDateTime()
    .describe("Question Theme's last update date");
}

export {
  zQuestionThemeId,
  zQuestionThemeSlug,
  zQuestionThemeLabel,
  zQuestionThemeLocalizedLabel,
  zQuestionThemeAliases,
  zQuestionThemeLocalizedAliases,
  zQuestionThemeDescription,
  zQuestionThemeLocalizedDescription,
  zQuestionThemeColor,
  zQuestionThemeStatus,
  zQuestionThemeCreatedAt,
  zQuestionThemeUpdatedAt,
};