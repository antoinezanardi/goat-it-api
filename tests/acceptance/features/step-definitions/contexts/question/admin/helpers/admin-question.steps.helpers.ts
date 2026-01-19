import { expect } from "expect";

import type { AdminQuestionDto } from "@question/application/dto/admin-question/admin-question.dto";

import type { ADMIN_QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/admin/datatables/admin-question.datatables.schemas";
import type { QUESTION_AUTHOR_DATATABLE_ROW_SCHEMA, QUESTION_DATATABLE_ROW_SCHEMA, QUESTION_CONTENT_DATATABLE_ROW_SCHEMA, QUESTION_REJECTION_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/public/datatables/question.datatables.schemas";

import type { z } from "zod";

function findQuestionByIdOrThrow<T extends Pick<AdminQuestionDto, "id">>(questions: T[], id: string): T {
  const question = questions.find(questionItem => questionItem.id === id);
  if (!question) {
    throw new Error(`Question with id "${id}" not found`);
  }
  return question;
}

function expectQuestionDtoToMatch(questionDto: AdminQuestionDto, expectedQuestionDto: z.infer<typeof QUESTION_DATATABLE_ROW_SCHEMA>): void {
  expect(questionDto.id).toBe(expectedQuestionDto.id);
  expect(questionDto.cognitiveDifficulty).toBe(expectedQuestionDto.cognitiveDifficulty);
  expect(questionDto.status).toBe(expectedQuestionDto.status);
  expect(questionDto.sourceUrls).toStrictEqual(expectedQuestionDto.sourceUrls);
}

function expectQuestionContentDtoToMatch(questionDto: AdminQuestionDto, expectedContent: z.infer<typeof QUESTION_CONTENT_DATATABLE_ROW_SCHEMA>): void {
  expect(questionDto.content.statement).toBe(expectedContent.statement);
  expect(questionDto.content.answer).toBe(expectedContent.answer);
  expect(questionDto.content.context).toBe(expectedContent.context);
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

function expectQuestionAuthorDtoToMatch(questionDto: AdminQuestionDto, expectedAuthor: z.infer<typeof QUESTION_AUTHOR_DATATABLE_ROW_SCHEMA>): void {
  expect(questionDto.author.role).toBe(expectedAuthor.role);
  expect(questionDto.author.name).toBe(expectedAuthor.name);
  expect(questionDto.author.gameId).toBe(expectedAuthor.gameId);
}

function expectQuestionRejectionDtoToMatch(questionDto: AdminQuestionDto, expectedRejection: z.infer<typeof QUESTION_REJECTION_DATATABLE_ROW_SCHEMA>): void {
  expect(questionDto.rejection?.type).toBe(expectedRejection.type);
  expect(questionDto.rejection?.comment).toBe(expectedRejection.comment);
}

export {
  findQuestionByIdOrThrow,
  expectQuestionDtoToMatch,
  expectQuestionContentDtoToMatch,
  expectAdminQuestionThemeAssignmentsDtoToMatch,
  expectQuestionAuthorDtoToMatch,
  expectQuestionRejectionDtoToMatch,
};