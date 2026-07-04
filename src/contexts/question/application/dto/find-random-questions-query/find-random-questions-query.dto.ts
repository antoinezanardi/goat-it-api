import { createZodDto } from "nestjs-zod";

import { FIND_RANDOM_QUESTIONS_QUERY_DTO } from "@question/application/dto/find-random-questions-query/find-random-questions-query.dto.shape";

class FindRandomQuestionsQueryNestZodDto extends createZodDto(FIND_RANDOM_QUESTIONS_QUERY_DTO) {}

export { FindRandomQuestionsQueryNestZodDto };