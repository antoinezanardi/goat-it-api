import { faker } from "@faker-js/faker";

import type { QuestionThemeAssignmentDto } from "@question/application/dto/question/question-theme-assignment/question-theme-assignment.dto";

import { createFakeQuestionThemeDto } from "@faketories/contexts/question/question-theme/dto/question-theme.dto.faketory";

function createFakeQuestionThemeAssignmentDto(assign: Partial<QuestionThemeAssignmentDto> = {}): QuestionThemeAssignmentDto {
  return {
    theme: createFakeQuestionThemeDto(),
    isPrimary: faker.datatype.boolean(),
    isHint: faker.datatype.boolean(),
    ...assign,
  };
}

export {
  createFakeQuestionThemeAssignmentDto,
};