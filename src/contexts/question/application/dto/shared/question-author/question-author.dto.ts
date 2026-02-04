import { createZodDto } from "nestjs-zod";

import { QUESTION_AUTHOR_DTO } from "@question/application/dto/shared/question-author/question-author.dto.shape";

class QuestionAuthorNestZodDto extends createZodDto(QUESTION_AUTHOR_DTO) {}

export { QuestionAuthorNestZodDto };