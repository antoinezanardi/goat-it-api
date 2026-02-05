import { expect } from "expect";

import type { AdminQuestionDto } from "@question/application/dto/admin-question/admin-question.dto.shape";
import type { QuestionDto } from "@question/application/dto/question/question.dto.shape";

import type { QUESTION_AUTHOR_DATATABLE_ROW_SCHEMA, QUESTION_CONTENT_DATATABLE_ROW_SCHEMA, QUESTION_DATATABLE_ROW_SCHEMA, QUESTION_REJECTION_DATATABLE_ROW_SCHEMA, QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/public/datatables/question.datatables.schemas";

import type { z } from "zod";

function findQuestionByIdOrThrow<T extends Pick<QuestionDto, "id">>(questions: T[], id: string): T {
  const question = questions.find(questionItem => questionItem.id === id);
  if (!question) {
    throw new Error(`Question with id "${id}" not found`);
  }
  return question;
}

function expectQuestionDtoToMatch(questionDto: QuestionDto, expectedQuestionDto: z.infer<typeof QUESTION_DATATABLE_ROW_SCHEMA>): void {
  expect(questionDto.id).toBe(expectedQuestionDto.id);
  expect(questionDto.cognitiveDifficulty).toBe(expectedQuestionDto.cognitiveDifficulty);
  expect(questionDto.status).toBe(expectedQuestionDto.status);
  expect(questionDto.sourceUrls).toStrictEqual(expectedQuestionDto.sourceUrls);
}

function expectQuestionContentDtoToMatch(questionDto: QuestionDto, expectedContent: z.infer<typeof QUESTION_CONTENT_DATATABLE_ROW_SCHEMA>): void {
  expect(questionDto.content.statement).toBe(expectedContent.statement);
  expect(questionDto.content.answer).toBe(expectedContent.answer);
  expect(questionDto.content.context).toBe(expectedContent.context);
}

function expectQuestionThemeAssignmentsDtoToMatch(questionDto: QuestionDto, expectedThemeAssignments: z.infer<typeof QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA>[]): void {
  expect(questionDto.themes).toHaveLength(expectedThemeAssignments.length);

  for (const [index, expectedTheme] of expectedThemeAssignments.entries()) {
    const questionThemeAssignment = questionDto.themes[index];

    expect(questionThemeAssignment.isPrimary).toBe(expectedTheme.isPrimary);
    expect(questionThemeAssignment.isHint).toBe(expectedTheme.isHint);
    expect(questionThemeAssignment.theme.slug).toBe(expectedTheme.slug);
    expect(questionThemeAssignment.theme.label).toBe(expectedTheme.label);
    expect(questionThemeAssignment.theme.description).toBe(expectedTheme.description);
  }
}

function expectQuestionAuthorDtoToMatch(questionDto: QuestionDto | AdminQuestionDto, expectedAuthor: z.infer<typeof QUESTION_AUTHOR_DATATABLE_ROW_SCHEMA>): void {
  expect(questionDto.author.role).toBe(expectedAuthor.role);
  expect(questionDto.author.name).toBe(expectedAuthor.name);
  expect(questionDto.author.gameId).toBe(expectedAuthor.gameId);
}

function expectQuestionRejectionDtoToMatch(questionDto: QuestionDto | AdminQuestionDto, expectedRejection: z.infer<typeof QUESTION_REJECTION_DATATABLE_ROW_SCHEMA>): void {
  expect(questionDto.rejection?.type).toBe(expectedRejection.type);
  expect(questionDto.rejection?.comment).toBe(expectedRejection.comment);
}

export {
  findQuestionByIdOrThrow,
  expectQuestionDtoToMatch,
  expectQuestionContentDtoToMatch,
  expectQuestionThemeAssignmentsDtoToMatch,
  expectQuestionAuthorDtoToMatch,
  expectQuestionRejectionDtoToMatch,
};