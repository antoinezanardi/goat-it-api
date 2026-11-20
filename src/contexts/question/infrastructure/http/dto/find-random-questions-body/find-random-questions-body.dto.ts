import { createZodDto } from "nestjs-zod";

import { FIND_RANDOM_QUESTIONS_BODY_DTO } from "@question/application/dto/find-random-questions-body/find-random-questions-body.dto.shape";

class FindRandomQuestionsBodyNestZodDto extends createZodDto(FIND_RANDOM_QUESTIONS_BODY_DTO) {}

export { FindRandomQuestionsBodyNestZodDto };