import { createZodDto } from "nestjs-zod";

import { ADMIN_FIND_QUESTIONS_SORT_QUERY_DTO } from "@question/application/dto/admin-find-questions-sort-query/admin-find-questions-sort-query.dto.shape";

class AdminFindQuestionsSortQueryNestZodDto extends createZodDto(ADMIN_FIND_QUESTIONS_SORT_QUERY_DTO) {}

export { AdminFindQuestionsSortQueryNestZodDto };