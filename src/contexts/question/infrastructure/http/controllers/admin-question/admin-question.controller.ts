import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";

import { AdminAuth } from "@src/infrastructure/api/auth/providers/decorators/admin-auth/admin-auth.decorator";
import { SwaggerTags } from "@src/infrastructure/api/server/swagger/constants/swagger.enums";

import { ControllerPrefixes } from "@shared/infrastructure/http/controllers/controllers.enums";

import { AdminQuestionDto } from "@question/application/dto/admin-question/admin-question.dto";
import { createAdminQuestionDtoFromEntity } from "@question/application/mappers/question/question.dto.mappers";
import { FindAllQuestionsUseCase } from "@question/application/use-cases/find-all-questions/find-all-questions.use-case";

@AdminAuth()
@Controller(`${ControllerPrefixes.ADMIN}/${ControllerPrefixes.QUESTIONS}`)
export class AdminQuestionController {
  public constructor(private readonly findAllQuestionsUseCase: FindAllQuestionsUseCase) {}

  @Get()
  @ApiOperation({
    tags: [
      SwaggerTags.ADMIN,
      SwaggerTags.QUESTIONS,
    ],
    summary: "Get all questions for backend administration",
    description: "Get the list of all questions available in the database with detailed structure for backend administration.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: [AdminQuestionDto],
  })
  public async findAllQuestions(): Promise<AdminQuestionDto[]> {
    const questions = await this.findAllQuestionsUseCase.list();

    return questions.map(question => createAdminQuestionDtoFromEntity(question));
  }
}