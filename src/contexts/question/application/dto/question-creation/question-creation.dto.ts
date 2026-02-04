import { createZodDto } from "nestjs-zod";

import { QUESTION_CREATION_DTO } from "@question/application/dto/question-creation/question-creation.schema";

class QuestionCreationDto extends createZodDto(QUESTION_CREATION_DTO) {}

export { QuestionCreationDto };