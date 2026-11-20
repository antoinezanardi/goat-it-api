import { createZodDto } from "nestjs-zod";

import { QUESTION_MODIFICATION_DTO } from "@question/application/dto/question-modification/question-modification.dto.shape";

class QuestionModificationNestZodDto extends createZodDto(QUESTION_MODIFICATION_DTO) {}

export { QuestionModificationNestZodDto };