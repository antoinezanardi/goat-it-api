import { faker } from "@faker-js/faker";

import type { QuestionThemeAssignmentCreationDto } from "@question/application/dto/question-creation/question-theme-assignment-creation/question-theme-assignment-creation.dto";

function createFakeQuestionThemeAssignmentCreationDto(assign: Partial<QuestionThemeAssignmentCreationDto> = {}): QuestionThemeAssignmentCreationDto {
  return {
    themeId: faker.database.mongodbObjectId(),
    isPrimary: faker.datatype.boolean(),
    isHint: faker.datatype.boolean(),
    ...assign,
  };
}

export { createFakeQuestionThemeAssignmentCreationDto };