import { faker } from "@faker-js/faker";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import type { QuestionThemeCreationDto } from "@question-theme/application/dto/question-theme-creation/question-theme-creation.dto.shape";

function createFakeQuestionThemeCreationDto(creationDto: Partial<QuestionThemeCreationDto> = {}): QuestionThemeCreationDto {
  return {
    slug: faker.lorem.slug(),
    label: createFakeLocalizedText(),
    aliases: createFakeLocalizedTexts(),
    description: createFakeLocalizedText(),
    color: faker.helpers.maybe(() => faker.color.rgb({ casing: "upper" })),
    ...creationDto,
  };
}

export { createFakeQuestionThemeCreationDto };