import { expect } from "expect";

import type { AdminQuestionDto } from "@question/application/dto/admin-question/admin-question.dto.shape";

import { expectLocalizedTextFieldToBe } from "@acceptance-features/step-definitions/shared/locale/helpers/locale.steps.helpers";
import type { ADMIN_QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA, ADMIN_QUESTION_THEME_ASSIGNMENT_LABEL_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/admin/datatables/admin-question.datatables.schemas";
import type { QUESTION_CONTENT_TRIVIA_DATATABLE_ROW_SCHEMA, QUESTION_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/public/datatables/question.datatables.schemas";

import type { z } from "zod";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

function findQuestionByIdOrThrow<T extends Pick<AdminQuestionDto, "id">>(questions: T[], id: string): T {
  const question = questions.find(questionItem => questionItem.id === id);
  if (!question) {
    throw new Error(`Question with id "${id}" not found`);
  }
  return question;
}

function expectAdminQuestionDtoToMatch(questionDto: AdminQuestionDto, expectedQuestionDto: z.infer<typeof QUESTION_DATATABLE_ROW_SCHEMA>): void {
  expect(questionDto.id).toBe(expectedQuestionDto.id);
  expect(questionDto.cognitiveDifficulty).toBe(expectedQuestionDto.cognitiveDifficulty);
  expect(questionDto.status).toBe(expectedQuestionDto.status);
  expect(questionDto.sourceUrls).toStrictEqual(expectedQuestionDto.sourceUrls);
}

function expectAdminQuestionThemeAssignmentsDtoToMatch(
  questionDto: AdminQuestionDto,
  expectedThemeAssignments: z.infer<typeof ADMIN_QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA>[],
): void {
  expect(questionDto.themes).toHaveLength(expectedThemeAssignments.length);

  for (const [index, expectedTheme] of expectedThemeAssignments.entries()) {
    const questionThemeAssignment = questionDto.themes[index];

    expect(questionThemeAssignment.isPrimary).toBe(expectedTheme.isPrimary);
    expect(questionThemeAssignment.isHint).toBe(expectedTheme.isHint);
    expect(questionThemeAssignment.theme.slug).toBe(expectedTheme.slug);
  }
}

function expectAdminQuestionDtoToHaveTriviaForLocale(
  questionDto: AdminQuestionDto,
  locale: Locale,
  localizedTriviaRows: z.infer<typeof QUESTION_CONTENT_TRIVIA_DATATABLE_ROW_SCHEMA>[],
): void {
  const expectedTrivia = localizedTriviaRows.map(row => row.trivia);
  const triviaForLocale = questionDto.content.trivia?.[locale];

  expect(triviaForLocale).toStrictEqual(expectedTrivia);
}

function expectAdminQuestionDtoToHaveThemeWithLabel(
  questionDto: AdminQuestionDto,
  slug: string,
  localizedLabelRows: z.infer<typeof ADMIN_QUESTION_THEME_ASSIGNMENT_LABEL_DATATABLE_ROW_SCHEMA>[],
): void {
  const questionThemeAssignment = questionDto.themes.find(themeAssignment => themeAssignment.theme.slug === slug);
  if (!questionThemeAssignment) {
    throw new Error(`Question theme with slug "${slug}" not found in question with id "${questionDto.id}"`);
  }

  expectLocalizedTextFieldToBe(questionThemeAssignment.theme.label, localizedLabelRows, "label");
}

export {
  findQuestionByIdOrThrow,
  expectAdminQuestionDtoToMatch,
  expectAdminQuestionThemeAssignmentsDtoToMatch,
  expectAdminQuestionDtoToHaveTriviaForLocale,
  expectAdminQuestionDtoToHaveThemeWithLabel,
};