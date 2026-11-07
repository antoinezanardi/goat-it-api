import { createZodDto } from "nestjs-zod";

import { QUESTION_STATS_DTO } from "@question/application/dto/question-stats/question-stats.dto.shape";

class QuestionStatsNestZodDto extends createZodDto(QUESTION_STATS_DTO) {}

export { QuestionStatsNestZodDto };