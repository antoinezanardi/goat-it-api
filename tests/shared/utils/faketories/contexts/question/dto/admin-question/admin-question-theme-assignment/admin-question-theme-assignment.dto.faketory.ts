import { faker } from "@faker-js/faker";

import type { AdminQuestionThemeAssignmentDto } from "@question/application/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto";

import { createFakeAdminQuestionThemeDto } from "@faketories/contexts/question/question-theme/dto/question-theme.dto.faketory";

function createFakeAdminQuestionThemeAssignmentDto(assign: Partial<AdminQuestionThemeAssignmentDto> = {}): AdminQuestionThemeAssignmentDto {
  return {
    theme: createFakeAdminQuestionThemeDto(),
    isPrimary: faker.datatype.boolean(),
    isHint: faker.datatype.boolean(),
    ...assign,
  };
}

export {
  createFakeAdminQuestionThemeAssignmentDto,
};