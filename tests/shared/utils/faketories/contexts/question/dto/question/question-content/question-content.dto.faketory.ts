import { faker } from "@faker-js/faker";

import type { QuestionContentDto } from "@question/application/dto/question/question-content/question-content.dto";

function createFakeQuestionContentDto(questionContentDto: Partial<QuestionContentDto> = {}): QuestionContentDto {
  return {
    statement: faker.lorem.sentence(),
    answer: faker.lorem.sentence(),
    context: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
    trivia: faker.datatype.boolean() ? [faker.lorem.sentence(), faker.lorem.sentence()] : undefined,
    ...questionContentDto,
  };
}

export {
  createFakeQuestionContentDto,
};