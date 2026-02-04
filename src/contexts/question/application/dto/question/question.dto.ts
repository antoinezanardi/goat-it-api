import { createZodDto } from "nestjs-zod";

import { QUESTION_DTO } from "@question/application/dto/question/question.dto.shape";

class QuestionNestZodDto extends createZodDto(QUESTION_DTO) {}

export { QuestionNestZodDto };