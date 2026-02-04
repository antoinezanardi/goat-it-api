import { createZodDto } from "nestjs-zod";

import { QUESTION_DTO } from "@question/application/dto/question/question.schema";

class QuestionDto extends createZodDto(QUESTION_DTO) {}

export { QuestionDto };