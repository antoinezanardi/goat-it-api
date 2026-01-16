import { expect } from "expect";

import type { AdminQuestionThemeDto } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto";
import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";

import type { ADMIN_QUESTION_THEME_DATATABLE_ROW_SCHEMA, QUESTION_THEME_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/question-theme/datatables/question-theme.datatables.schemas";

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

function expectAdminQuestionThemeDtoToMatch(
  adminQuestionThemeDto: AdminQuestionThemeDto,
  expectedAdminQuestionThemeDto: z.infer<typeof ADMIN_QUESTION_THEME_DATATABLE_ROW_SCHEMA>,
): void {
  expect(adminQuestionThemeDto.slug).toBe(expectedAdminQuestionThemeDto.slug);
  expect(adminQuestionThemeDto.status).toBe(expectedAdminQuestionThemeDto.status);
}

export {
  findQuestionThemeBySlugOrThrow,
  expectQuestionThemeDtoToMatch,
  expectAdminQuestionThemeDtoToMatch,
};