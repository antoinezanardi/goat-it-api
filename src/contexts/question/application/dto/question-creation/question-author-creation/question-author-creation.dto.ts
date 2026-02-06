import { createZodDto } from "nestjs-zod";

import { QUESTION_AUTHOR_CREATION_DTO } from "@question/application/dto/question-creation/question-author-creation/question-author-creation.dto.shape";

class QuestionAuthorCreationNestZodDto extends createZodDto(QUESTION_AUTHOR_CREATION_DTO) {}

export { QuestionAuthorCreationNestZodDto };