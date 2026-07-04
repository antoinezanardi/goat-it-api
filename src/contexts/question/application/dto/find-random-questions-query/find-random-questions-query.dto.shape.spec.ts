import { ZodError } from "zod";

import { RANDOM_QUESTIONS_LIMIT_DEFAULT, RANDOM_QUESTIONS_LIMIT_DESCRIPTION, RANDOM_QUESTIONS_LIMIT_MAXIMUM, RANDOM_QUESTIONS_LIMIT_MINIMUM } from "@question/application/dto/find-random-questions-query/constants/find-random-questions-query.dto.constants";
import { FIND_RANDOM_QUESTIONS_QUERY_DTO } from "@question/application/dto/find-random-questions-query/find-random-questions-query.dto.shape";
import type { FindRandomQuestionsQueryDto } from "@question/application/dto/find-random-questions-query/find-random-questions-query.dto.shape";

import { createFakeFindRandomQuestionsQueryDto } from "@faketories/contexts/question/dto/find-random-questions-query/find-random-questions-query.dto.faketory";

import type { z } from "zod";

describe("Find Random Questions Query DTO Shape", () => {
  let validDto: FindRandomQuestionsQueryDto;

  beforeEach(() => {
    validDto = createFakeFindRandomQuestionsQueryDto();
  });

  it("should pass validation when a valid dto is provided.", () => {
    expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(validDto)).not.toThrow();
  });

  describe("limit", () => {
    it("should pass validation when limit is a valid integer at or above the minimum.", () => {
      const dto = createFakeFindRandomQuestionsQueryDto({ limit: RANDOM_QUESTIONS_LIMIT_MINIMUM });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when limit is a valid integer above the minimum.", () => {
      const dto = createFakeFindRandomQuestionsQueryDto({ limit: RANDOM_QUESTIONS_LIMIT_DEFAULT });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when limit is a larger valid integer.", () => {
      const dto = createFakeFindRandomQuestionsQueryDto({ limit: RANDOM_QUESTIONS_LIMIT_MAXIMUM });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should pass validation when limit is exactly at the maximum.", () => {
      const dto = createFakeFindRandomQuestionsQueryDto({ limit: RANDOM_QUESTIONS_LIMIT_MAXIMUM });

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when limit is above maximum.", () => {
      const dtoWithInvalidLimit = { ...validDto, limit: RANDOM_QUESTIONS_LIMIT_MAXIMUM + 1 };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidLimit)).toThrow(ZodError);
    });

    it("should throw zod error when limit is 0 (below minimum).", () => {
      const dtoWithInvalidLimit = { ...validDto, limit: 0 };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidLimit)).toThrow(ZodError);
    });

    it("should throw zod error when limit is -1 (negative).", () => {
      const dtoWithInvalidLimit = { ...validDto, limit: -1 };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidLimit)).toThrow(ZodError);
    });

    it.each([1.5, "string"])("should throw zod error when limit is '%s' (non-integer or non-number).", limit => {
      const dtoWithInvalidLimit = { ...validDto, limit };

      expect(() => FIND_RANDOM_QUESTIONS_QUERY_DTO.parse(dtoWithInvalidLimit)).toThrow(ZodError);
    });

    it("should use default value 20 when limit is not provided.", () => {
      const result = FIND_RANDOM_QUESTIONS_QUERY_DTO.parse({});

      expect(result.limit).toBe(RANDOM_QUESTIONS_LIMIT_DEFAULT);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = FIND_RANDOM_QUESTIONS_QUERY_DTO.shape.limit.meta();
      const expectedMetadata = { description: RANDOM_QUESTIONS_LIMIT_DESCRIPTION, example: RANDOM_QUESTIONS_LIMIT_DEFAULT };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should accept any coercible value when checking the input type.", () => {
      expectTypeOf<z.input<typeof FIND_RANDOM_QUESTIONS_QUERY_DTO>["limit"]>().toEqualTypeOf<unknown>();
    });
  });
});