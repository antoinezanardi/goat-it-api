import { faker } from "@faker-js/faker";

import type { AdminQuestionContentDto } from "@question/application/dto/admin-question/admin-question-content/admin-question-content.dto.shape";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

function createFakeAdminQuestionContentDto(adminQuestionContentDto: Partial<AdminQuestionContentDto> = {}): AdminQuestionContentDto {
  return {
    statement: createFakeLocalizedText(),
    answer: createFakeLocalizedText(),
    context: faker.datatype.boolean() ? createFakeLocalizedText() : undefined,
    trivia: faker.datatype.boolean() ? createFakeLocalizedTexts() : undefined,
    ...adminQuestionContentDto,
  };
}

export {
  createFakeAdminQuestionContentDto,
};