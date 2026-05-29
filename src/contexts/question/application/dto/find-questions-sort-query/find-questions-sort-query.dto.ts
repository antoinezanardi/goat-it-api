import { createZodDto } from "nestjs-zod";

import { FIND_QUESTIONS_SORT_QUERY_DTO } from "@question/application/dto/find-questions-sort-query/find-questions-sort-query.dto.shape";

class FindQuestionsSortQueryNestZodDto extends createZodDto(FIND_QUESTIONS_SORT_QUERY_DTO) {}

export { FindQuestionsSortQueryNestZodDto };