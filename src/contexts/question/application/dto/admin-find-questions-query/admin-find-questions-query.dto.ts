import { createZodDto } from "nestjs-zod";

import { ADMIN_FIND_QUESTIONS_QUERY_DTO } from "@question/application/dto/admin-find-questions-query/admin-find-questions-query.dto.shape";

class AdminFindQuestionsQueryNestZodDto extends createZodDto(ADMIN_FIND_QUESTIONS_QUERY_DTO) {}

export { AdminFindQuestionsQueryNestZodDto };