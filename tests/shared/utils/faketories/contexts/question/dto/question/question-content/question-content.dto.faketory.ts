import { faker } from "@faker-js/faker";

import type { QuestionContentDto } from "@question/application/dto/question/question-content/question-content.dto.shape";

function createFakeQuestionContentDto(questionContentDto: Partial<QuestionContentDto> = {}): QuestionContentDto {
  return {
    statement: faker.lorem.sentence(),
    answer: faker.lorem.sentence(),
    context: faker.helpers.maybe(faker.lorem.sentence),
    trivia: faker.helpers.maybe(() => [faker.lorem.sentence(), faker.lorem.sentence()]),
    ...questionContentDto,
  };
}

export {
  createFakeQuestionContentDto,
};