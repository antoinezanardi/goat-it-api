import type { FindRandomQuestionsQueryDto } from "@question/application/dto/find-random-questions-query/find-random-questions-query.dto.shape";

import type { FindRandomOptions } from "@question/domain/types/question.types";

function createFindRandomOptionsFromQueryDto(queryDto: FindRandomQuestionsQueryDto): FindRandomOptions {
  return { limit: queryDto.limit };
}

export { createFindRandomOptionsFromQueryDto };