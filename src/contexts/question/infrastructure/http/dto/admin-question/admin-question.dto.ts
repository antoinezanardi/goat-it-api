import { createZodDto } from "nestjs-zod";

import { ADMIN_QUESTION_DTO } from "@question/application/dto/admin-question/admin-question.dto.shape";

class AdminQuestionNestZodDto extends createZodDto(ADMIN_QUESTION_DTO) {}

export { AdminQuestionNestZodDto };