import { createZodDto } from "nestjs-zod";

import { FIND_QUESTION_THEMES_SORT_QUERY_DTO } from "@question/modules/question-theme/application/dto/find-question-themes-sort-query/find-question-themes-sort-query.dto.shape";

class FindQuestionThemesSortQueryNestZodDto extends createZodDto(FIND_QUESTION_THEMES_SORT_QUERY_DTO) {}

export { FindQuestionThemesSortQueryNestZodDto };