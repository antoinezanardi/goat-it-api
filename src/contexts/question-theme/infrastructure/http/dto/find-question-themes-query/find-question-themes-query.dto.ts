import { createZodDto } from "nestjs-zod";

import { FIND_QUESTION_THEMES_QUERY_DTO } from "@question-theme/application/dto/find-question-themes-query/find-question-themes-query.dto.shape";

class FindQuestionThemesQueryNestZodDto extends createZodDto(FIND_QUESTION_THEMES_QUERY_DTO) {}

export { FindQuestionThemesQueryNestZodDto };