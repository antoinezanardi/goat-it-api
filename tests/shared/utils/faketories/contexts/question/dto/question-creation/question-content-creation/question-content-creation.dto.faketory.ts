import { faker } from "@faker-js/faker";

import type { QuestionContentCreationDto } from "@question/application/dto/question-creation/question-content-creation/question-content-creation.dto.shape";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

function createFakeQuestionContentCreationDto(content: Partial<QuestionContentCreationDto> = {}): QuestionContentCreationDto {
  return {
    statement: createFakeLocalizedText(),
    answer: createFakeLocalizedText(),
    context: faker.datatype.boolean() ? createFakeLocalizedText() : undefined,
    trivia: faker.datatype.boolean() ? createFakeLocalizedTexts() : undefined,
    ...content,
  };
}

export { createFakeQuestionContentCreationDto };