import { faker } from "@faker-js/faker";

import type { AdminQuestionContentDto } from "@question/application/dto/admin-question/admin-question-content/admin-question-content.dto.shape";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

function createFakeAdminQuestionContentDto(adminQuestionContentDto: Partial<AdminQuestionContentDto> = {}): AdminQuestionContentDto {
  return {
    statement: createFakeLocalizedText(),
    answer: createFakeLocalizedText(),
    context: faker.helpers.maybe(createFakeLocalizedText),
    trivia: faker.helpers.maybe(createFakeLocalizedTexts),
    ...adminQuestionContentDto,
  };
}

export {
  createFakeAdminQuestionContentDto,
};