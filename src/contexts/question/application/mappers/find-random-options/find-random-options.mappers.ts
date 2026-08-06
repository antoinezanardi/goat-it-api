import type { FindRandomQuestionsBodyDto } from "@question/application/dto/find-random-questions-body/find-random-questions-body.dto.shape";

import type { FindRandomQuestionsOptions } from "@question/domain/types/question.types";

function createFindRandomQuestionsOptionsFromBodyDto(bodyDto: FindRandomQuestionsBodyDto): FindRandomQuestionsOptions {
  return {
    limit: bodyDto.limit,
    excludedIds: bodyDto.excludedIds,
    categories: bodyDto.categories,
    cognitiveDifficulties: bodyDto.cognitiveDifficulties,
    themeIds: bodyDto.themeIds,
  };
}

export { createFindRandomQuestionsOptionsFromBodyDto };