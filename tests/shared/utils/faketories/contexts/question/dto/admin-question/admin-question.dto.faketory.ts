import { faker } from "@faker-js/faker";

import type { AdminQuestionDto } from "@question/application/dto/admin-question/admin-question.dto.shape";
import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES, QUESTION_STATUSES } from "@question/domain/constants/question.constants";

import { createFakeAdminQuestionThemeAssignmentDto } from "@faketories/contexts/question/dto/admin-question/admin-question-theme-assignment/admin-question-theme-assignment.dto.faketory";
import { createFakeAdminQuestionContentDto } from "@faketories/contexts/question/dto/admin-question/admin-question-content/admin-question-content.dto.faketory";
import { createFakeQuestionAuthorDto } from "@faketories/contexts/question/dto/shared/question-author/question-author.dto.faketory";
import { createFakeQuestionRejectionDto } from "@faketories/contexts/question/dto/shared/question-rejection/question-rejection.dto.faketory";

function createFakeAdminQuestionDto(adminQuestionDto: Partial<AdminQuestionDto> = {}): AdminQuestionDto {
  return {
    id: faker.database.mongodbObjectId(),
    category: faker.helpers.arrayElement(QUESTION_CATEGORIES),
    themes: [createFakeAdminQuestionThemeAssignmentDto()],
    content: createFakeAdminQuestionContentDto(),
    cognitiveDifficulty: faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES),
    author: createFakeQuestionAuthorDto(),
    status: faker.helpers.arrayElement(QUESTION_STATUSES),
    rejection: faker.helpers.maybe(createFakeQuestionRejectionDto),
    sourceUrls: faker.helpers.uniqueArray(() => faker.internet.url(), 2),
    createdAt: faker.date.anytime().toISOString(),
    updatedAt: faker.date.anytime().toISOString(),
    ...adminQuestionDto,
  };
}

export {
  createFakeAdminQuestionDto,
};