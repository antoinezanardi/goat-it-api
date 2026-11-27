import { createZodDto } from "nestjs-zod";

import { QUESTION_THEME_STATS_DTO } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

class QuestionThemeStatsNestZodDto extends createZodDto(QUESTION_THEME_STATS_DTO) {}

export { QuestionThemeStatsNestZodDto };