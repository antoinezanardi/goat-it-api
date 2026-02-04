import { createZodDto } from "nestjs-zod";

import { QUESTION_AUTHOR_DTO } from "@question/application/dto/shared/question-author/question-author.schema";

class QuestionAuthorDto extends createZodDto(QUESTION_AUTHOR_DTO) {}

export { QuestionAuthorDto };