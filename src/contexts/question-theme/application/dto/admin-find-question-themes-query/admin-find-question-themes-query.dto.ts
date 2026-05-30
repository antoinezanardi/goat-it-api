import { createZodDto } from "nestjs-zod";

import { ADMIN_FIND_QUESTION_THEMES_QUERY_DTO } from "@question-theme/application/dto/admin-find-question-themes-query/admin-find-question-themes-query.dto.shape";

class AdminFindQuestionThemesQueryNestZodDto extends createZodDto(ADMIN_FIND_QUESTION_THEMES_QUERY_DTO) {}

export { AdminFindQuestionThemesQueryNestZodDto };