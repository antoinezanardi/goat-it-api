import { expect } from "expect";

import type { QuestionDto } from "@question/application/dto/question/question.dto";

function findQuestionByIdOrThrow<T extends Pick<QuestionDto, "id">>(questions: T[], id: string): T {
  const question = questions.find(theme => theme.id === id);
  if (!question) {
    throw new Error(`Question with id "${id}" not found`);
  }
  return question;
}

function expectQuestionDtoToMatch(questionDto: QuestionDto, expectedQuestionDto: Record<string, string>): void {
  const rawSourceUrls = expectedQuestionDto.sourceUrls.trim();
  const expectedQuestionDtoSourceUrls = rawSourceUrls ? rawSourceUrls.split(",").map(alias => alias.trim()) : [];

  expect(questionDto.id).toBe(expectedQuestionDto.id);
  expect(questionDto.cognitiveDifficulty).toBe(expectedQuestionDto.cognitiveDifficulty);
  expect(questionDto.status).toBe(expectedQuestionDto.status);
  expect(questionDto.sourceUrls).toStrictEqual(expectedQuestionDtoSourceUrls);
}

export {
  findQuestionByIdOrThrow,
  expectQuestionDtoToMatch,
};