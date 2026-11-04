import { faker } from "@faker-js/faker";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

import type { QuestionThemeModificationDto } from "@question-theme/application/dto/question-theme-modification/question-theme-modification.dto.shape";

function createFakeQuestionThemeModificationDto(modificationDto: Partial<QuestionThemeModificationDto> = {}): QuestionThemeModificationDto {
  return {
    slug: faker.helpers.maybe(faker.lorem.slug),
    label: faker.helpers.maybe(createFakeLocalizedText),
    aliases: faker.helpers.maybe(createFakeLocalizedTexts),
    description: faker.helpers.maybe(createFakeLocalizedText),
    color: faker.helpers.maybe(() => faker.color.rgb({ casing: "upper" })),
    ...modificationDto,
  };
}

export { createFakeQuestionThemeModificationDto };