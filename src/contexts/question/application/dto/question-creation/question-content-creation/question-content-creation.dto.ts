import { createZodDto } from "nestjs-zod";

import { QUESTION_CONTENT_CREATION_DTO } from "@question/application/dto/question-creation/question-content-creation/question-content-creation.schema";

class QuestionContentCreationDto extends createZodDto(QUESTION_CONTENT_CREATION_DTO) {}

export { QuestionContentCreationDto };