import { expect } from "expect";

import type { QuestionDto } from "@question/application/dto/question/question.dto";

function findQuestionByIdOrThrow<T extends Pick<QuestionDto, "id">>(questions: T[], id: string): T {
  const question = questions.find(questionItem => questionItem.id === id);
  if (!question) {
    throw new Error(`Question with id "${id}" not found`);
  }
  return question;
}

function expectQuestionDtoToMatch(questionDto: QuestionDto, expectedQuestionDto: Record<string, string>): void {
  const rawSourceUrls = expectedQuestionDto.sourceUrls.trim();
  const expectedQuestionDtoSourceUrls = rawSourceUrls ? rawSourceUrls.split(",").map(url => url.trim()) : [];

  expect(questionDto.id).toBe(expectedQuestionDto.id);
  expect(questionDto.cognitiveDifficulty).toBe(expectedQuestionDto.cognitiveDifficulty);
  expect(questionDto.status).toBe(expectedQuestionDto.status);
  expect(questionDto.sourceUrls).toStrictEqual(expectedQuestionDtoSourceUrls);
}

function expectQuestionContentDtoToMatch(questionDto: QuestionDto, expectedContent: Record<string, string | undefined>): void {
  expect(questionDto.content.statement).toBe(expectedContent.statement);
  expect(questionDto.content.answer).toBe(expectedContent.answer);
  expect(questionDto.content.context).toBe(expectedContent.context);
}

function expectQuestionThemeAssignmentsDtoToMatch(questionDto: QuestionDto, expectedThemeAssignments: Record<string, string | boolean | undefined>[]): void {
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

function expectQuestionAuthorDtoToMatch(questionDto: QuestionDto, expectedAuthor: Record<string, string | undefined>): void {
  expect(questionDto.author.role).toBe(expectedAuthor.role);
  expect(questionDto.author.name).toBe(expectedAuthor.name);
  expect(questionDto.author.gameId).toBe(expectedAuthor.gameId);
}

function expectQuestionRejectionDtoToMatch(questionDto: QuestionDto, expectedRejection: Record<string, string | undefined>): void {
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