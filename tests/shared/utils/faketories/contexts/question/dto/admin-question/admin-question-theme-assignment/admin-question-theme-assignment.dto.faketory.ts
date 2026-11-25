import { faker } from "@faker-js/faker";

import { createFakeAdminQuestionThemeDto } from "@faketories/contexts/question-theme/contracts/dto/admin-question-theme/admin-question-theme.dto.faketory";

import type { AdminQuestionThemeAssignmentDto } from "@question/application/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto.shape";

function createFakeAdminQuestionThemeAssignmentDto(adminQuestionThemeAssignmentDto: Partial<AdminQuestionThemeAssignmentDto> = {}): AdminQuestionThemeAssignmentDto {
  return {
    theme: createFakeAdminQuestionThemeDto(),
    isPrimary: faker.datatype.boolean(),
    isHint: faker.datatype.boolean(),
    ...adminQuestionThemeAssignmentDto,
  };
}

export {
  createFakeAdminQuestionThemeAssignmentDto,
};