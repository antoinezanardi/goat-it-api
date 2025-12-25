import { expect } from "expect";

import type { AdminQuestionThemeDto } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto";
import type { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme/question-theme.dto";

function findQuestionThemeBySlugOrThrow<T extends Pick<QuestionThemeDto, "slug">>(questionThemes: T[], slug: string): T {
  const questionTheme = questionThemes.find(theme => theme.slug === slug);
  if (!questionTheme) {
    throw new Error(`Question theme with slug "${slug}" not found`);
  }
  return questionTheme;
}

function expectQuestionThemeDtoToMatch(questionThemeDto: QuestionThemeDto, expectedQuestionThemeDto: Record<string, string>): void {
  const rawAliases = expectedQuestionThemeDto.aliases.trim();
  const expectedQuestionThemeDtoAliases = rawAliases ? rawAliases.split(",").map(alias => alias.trim()) : [];

  expect(questionThemeDto.slug).toBe(expectedQuestionThemeDto.slug);
  expect(questionThemeDto.label).toBe(expectedQuestionThemeDto.label);
  expect(questionThemeDto.aliases).toStrictEqual(expectedQuestionThemeDtoAliases);
  expect(questionThemeDto.description).toBe(expectedQuestionThemeDto.description);
  expect(questionThemeDto.status).toBe(expectedQuestionThemeDto.status);
}

function expectAdminQuestionThemeDtoToMatch(adminQuestionThemeDto: AdminQuestionThemeDto, expectedAdminQuestionThemeDto: Record<string, string>): void {
  expect(adminQuestionThemeDto.slug).toBe(expectedAdminQuestionThemeDto.slug);
  expect(adminQuestionThemeDto.status).toBe(expectedAdminQuestionThemeDto.status);
}

export {
  findQuestionThemeBySlugOrThrow,
  expectQuestionThemeDtoToMatch,
  expectAdminQuestionThemeDtoToMatch,
};