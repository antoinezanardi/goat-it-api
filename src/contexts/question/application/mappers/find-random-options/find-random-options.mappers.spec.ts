import { createFindRandomOptionsFromQueryDto } from "@question/application/mappers/find-random-options/find-random-options.mappers";

import { createFakeFindRandomQuestionsQueryDto } from "@faketories/contexts/question/dto/find-random-questions-query/find-random-questions-query.dto.faketory";

import type { FindRandomOptions } from "@question/domain/types/question.types";

describe("Find Random Options Mappers", () => {
  describe(createFindRandomOptionsFromQueryDto, () => {
    it("should return find random options with the limit from query dto when called.", () => {
      const queryDto = createFakeFindRandomQuestionsQueryDto({ limit: 5 });

      const result = createFindRandomOptionsFromQueryDto(queryDto);

      const expected: FindRandomOptions = { limit: 5 };

      expect(result).toStrictEqual(expected);
    });

    it("should return find random options with a different limit when query dto has a different limit.", () => {
      const queryDto = createFakeFindRandomQuestionsQueryDto({ limit: 10 });

      const result = createFindRandomOptionsFromQueryDto(queryDto);

      const expected: FindRandomOptions = { limit: 10 };

      expect(result).toStrictEqual(expected);
    });
  });
});