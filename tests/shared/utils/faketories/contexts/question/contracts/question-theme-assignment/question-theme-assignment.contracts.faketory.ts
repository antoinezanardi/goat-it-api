import { faker } from "@faker-js/faker";

import type { QuestionThemeAssignmentCreationContract } from "@question/domain/types/question.contracts";

function createFakeQuestionThemeAssignmentCreationContract(assignment: Partial<QuestionThemeAssignmentCreationContract> = {}): QuestionThemeAssignmentCreationContract {
  return {
    themeId: faker.database.mongodbObjectId(),
    isHint: faker.datatype.boolean(),
    isPrimary: faker.datatype.boolean(),
    ...assignment,
  };
}

export { createFakeQuestionThemeAssignmentCreationContract };