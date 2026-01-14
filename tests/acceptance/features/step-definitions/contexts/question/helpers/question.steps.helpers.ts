import { expect } from "expect";

import type { QuestionDto } from "@question/application/dto/question/question.dto";

function expectQuestionDtoToMatch(questionDto: QuestionDto, expectedQuestionDto: Record<string, string>): void {
  const rawSourceUrls = expectedQuestionDto.sourceUrls.trim();
  const expectedQuestionThemeDtoSourceUrls = rawSourceUrls ? rawSourceUrls.split(",").map(alias => alias.trim()) : [];

  expect(questionDto.id).toBe(expectedQuestionDto.id);
  expect(questionDto.cognitiveDifficulty).toBe(expectedQuestionDto.cognitiveDifficulty);
  expect(questionDto.status).toBe(expectedQuestionDto.status);
  expect(questionDto.sourceUrls).toStrictEqual(expectedQuestionThemeDtoSourceUrls);
}

export {
  expectQuestionDtoToMatch,
};