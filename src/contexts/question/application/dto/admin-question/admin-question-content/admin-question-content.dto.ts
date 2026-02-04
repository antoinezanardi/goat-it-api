import { createZodDto } from "nestjs-zod";

import { ADMIN_QUESTION_CONTENT_DTO } from "@question/application/dto/admin-question/admin-question-content/admin-question-content.schema";

class AdminQuestionContentDto extends createZodDto(ADMIN_QUESTION_CONTENT_DTO) {}

export { AdminQuestionContentDto };