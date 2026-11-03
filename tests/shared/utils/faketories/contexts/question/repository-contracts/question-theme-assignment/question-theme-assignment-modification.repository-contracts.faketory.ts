import { faker } from "@faker-js/faker";

import type { QuestionThemeAssignmentModificationContract } from "@question/domain/repositories/question.repository-contracts.types";

function createFakeQuestionThemeAssignmentModificationContract(overrides: Partial<QuestionThemeAssignmentModificationContract> = {}): QuestionThemeAssignmentModificationContract {
  return {
    isPrimary: faker.helpers.maybe(() => true),
    isHint: faker.helpers.maybe(faker.datatype.boolean),
    ...overrides,
  };
}

export { createFakeQuestionThemeAssignmentModificationContract };