import { createZodDto } from "nestjs-zod";

import { ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO } from "@question/modules/question-theme/application/dto/admin-find-question-themes-sort-query/admin-find-question-themes-sort-query.dto.shape";

class AdminFindQuestionThemesSortQueryNestZodDto extends createZodDto(ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO) {}

export { AdminFindQuestionThemesSortQueryNestZodDto };