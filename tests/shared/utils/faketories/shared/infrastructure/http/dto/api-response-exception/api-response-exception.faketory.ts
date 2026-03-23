import { faker } from "@faker-js/faker";

import type { ApiResponseExceptionValidationDetailsDto } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception-validation-details/api-response-exception-validation-details.dto.shape";
import type { ApiResponseExceptionDto } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception.dto.shape";

function createFakeApiResponseExceptionValidationDetailsDto(overrides: Partial<ApiResponseExceptionValidationDetailsDto> = {}): ApiResponseExceptionValidationDetailsDto {
  return {
    message: faker.lorem.sentence(),
    path: [faker.lorem.word()],
    code: faker.helpers.replaceSymbols("ERR-##"),
    expected: faker.lorem.word(),
    ...overrides,
  };
}

function createFakeApiResponseExceptionDto(overrides: Partial<ApiResponseExceptionDto> = {}): ApiResponseExceptionDto {
  return {
    statusCode: faker.number.int({ min: 400, max: 599 }),
    message: faker.lorem.sentence(),
    error: "Bad Request",
    validationDetails: faker.helpers.maybe(() => [
      createFakeApiResponseExceptionValidationDetailsDto(),
      createFakeApiResponseExceptionValidationDetailsDto(),
      createFakeApiResponseExceptionValidationDetailsDto(),
    ]),
    errorCode: faker.helpers.maybe(() => faker.hacker.phrase().toLowerCase().replaceAll(/\s+/gu, "-").slice(0, 40)),
    ...overrides,
  };
}

export {
  createFakeApiResponseExceptionDto,
  createFakeApiResponseExceptionValidationDetailsDto,
};