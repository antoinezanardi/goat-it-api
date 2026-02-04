import { createZodDto } from "nestjs-zod";

import { QUESTION_AUTHOR_CREATION_DTO } from "@question/application/dto/question-creation/question-author-creation/question-author-creation.schema";

class QuestionAuthorCreationDto extends createZodDto(QUESTION_AUTHOR_CREATION_DTO) {}

export { QuestionAuthorCreationDto };