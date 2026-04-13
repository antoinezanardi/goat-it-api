import { faker } from "@faker-js/faker";

import type { QuestionThemeAssignmentModificationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment-modification.contracts";

function createFakeQuestionThemeAssignmentModificationContract(overrides: Partial<QuestionThemeAssignmentModificationContract> = {}): QuestionThemeAssignmentModificationContract {
  return {
    isPrimary: faker.helpers.maybe(() => true as const),
    isHint: faker.helpers.maybe(faker.datatype.boolean),
    ...overrides,
  };
}

export { createFakeQuestionThemeAssignmentModificationContract };