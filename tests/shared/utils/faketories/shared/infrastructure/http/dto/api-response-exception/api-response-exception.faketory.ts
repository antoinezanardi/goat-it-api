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
    validationDetails: faker.datatype.boolean() ? [
      createFakeApiResponseExceptionValidationDetailsDto(),
      createFakeApiResponseExceptionValidationDetailsDto(),
      createFakeApiResponseExceptionValidationDetailsDto(),
    ] : undefined,
    ...overrides,
  };
}

export {
  createFakeApiResponseExceptionDto,
  createFakeApiResponseExceptionValidationDetailsDto,
};