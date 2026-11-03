import { createZodDto } from "nestjs-zod";

import { FIND_QUESTIONS_QUERY_DTO } from "@question/application/dto/find-questions-query/find-questions-query.dto.shape";

class FindQuestionsQueryNestZodDto extends createZodDto(FIND_QUESTIONS_QUERY_DTO) {}

export { FindQuestionsQueryNestZodDto };