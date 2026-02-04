import { expect } from "expect";

import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto.shape";

import type { QUESTION_THEME_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/question-theme/public/datatables/question-theme.datatables.schemas";

import type { z } from "zod";

function findQuestionThemeBySlugOrThrow<T extends Pick<QuestionThemeDto, "slug">>(questionThemes: T[], slug: string): T {
  const questionTheme = questionThemes.find(theme => theme.slug === slug);
  if (!questionTheme) {
    throw new Error(`Question theme with slug "${slug}" not found`);
  }
  return questionTheme;
}

function expectQuestionThemeDtoToMatch(questionThemeDto: QuestionThemeDto, expectedQuestionThemeDto: z.infer<typeof QUESTION_THEME_DATATABLE_ROW_SCHEMA>): void {
  expect(questionThemeDto.slug).toBe(expectedQuestionThemeDto.slug);
  expect(questionThemeDto.label).toBe(expectedQuestionThemeDto.label);
  expect(questionThemeDto.aliases).toStrictEqual(expectedQuestionThemeDto.aliases);
  expect(questionThemeDto.description).toBe(expectedQuestionThemeDto.description);
  expect(questionThemeDto.status).toBe(expectedQuestionThemeDto.status);
}

export {
  findQuestionThemeBySlugOrThrow,
  expectQuestionThemeDtoToMatch,
};