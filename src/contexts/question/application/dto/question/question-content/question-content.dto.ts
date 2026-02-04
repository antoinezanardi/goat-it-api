import { createZodDto } from "nestjs-zod";

import { QUESTION_CONTENT_DTO } from "@question/application/dto/question/question-content/question-content.schema";

class QuestionContentDto extends createZodDto(QUESTION_CONTENT_DTO) {}

export { QuestionContentDto };