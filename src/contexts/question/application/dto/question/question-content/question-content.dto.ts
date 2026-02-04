import { createZodDto } from "nestjs-zod";

import { QUESTION_CONTENT_DTO } from "@question/application/dto/question/question-content/question-content.dto.shape";

class QuestionContentNestZodDto extends createZodDto(QUESTION_CONTENT_DTO) {}

export { QuestionContentNestZodDto };