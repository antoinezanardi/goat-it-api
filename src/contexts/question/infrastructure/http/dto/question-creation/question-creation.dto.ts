import { createZodDto } from "nestjs-zod";

import { QUESTION_CREATION_DTO } from "@question/application/dto/question-creation/question-creation.dto.shape";

class QuestionCreationNestZodDto extends createZodDto(QUESTION_CREATION_DTO) {}

export { QuestionCreationNestZodDto };