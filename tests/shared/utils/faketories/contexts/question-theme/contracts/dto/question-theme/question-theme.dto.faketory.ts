import { faker } from "@faker-js/faker";

import { QUESTION_THEME_STATUSES } from "@question-theme/domain/constants/question-theme.constants";

import type { QuestionThemeDto } from "@question-theme/contracts/dto/question-theme/question-theme.dto.shape";

function createFakeQuestionThemeDto(questionThemeDto: Partial<QuestionThemeDto> = {}): QuestionThemeDto {
  return {
    id: faker.database.mongodbObjectId(),
    slug: faker.lorem.slug(),
    label: faker.word.sample(),
    aliases: [faker.word.sample(), faker.word.sample(), faker.word.sample()],
    description: faker.word.sample(),
    color: faker.helpers.maybe(() => faker.color.rgb({ casing: "upper" })),
    status: faker.helpers.arrayElement(QUESTION_THEME_STATUSES),
    updatedAt: faker.date.anytime().toISOString(),
    createdAt: faker.date.anytime().toISOString(),
    ...questionThemeDto,
  };
}

export { createFakeQuestionThemeDto };