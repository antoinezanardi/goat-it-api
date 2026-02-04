import { createZodDto } from "nestjs-zod";

import { QUESTION_REJECTION_DTO } from "@question/application/dto/shared/question-rejection/question-rejection.schema";

class QuestionRejectionDto extends createZodDto(QUESTION_REJECTION_DTO) {}

export { QuestionRejectionDto };