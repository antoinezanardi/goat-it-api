import { faker } from "@faker-js/faker";

import type { QuestionThemeAssignmentModificationDto } from "@question/application/dto/question-theme-assignment-modification/question-theme-assignment-modification.dto.shape";

function createFakeQuestionThemeAssignmentModificationDto(overrides: Partial<QuestionThemeAssignmentModificationDto> = {}): QuestionThemeAssignmentModificationDto {
  return {
    isPrimary: faker.helpers.maybe(() => true),
    isHint: faker.helpers.maybe(faker.datatype.boolean),
    ...overrides,
  };
}

export { createFakeQuestionThemeAssignmentModificationDto };