import { Controller, Get, HttpStatus, Param } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";

import { GameAuth } from "@src/infrastructure/api/auth/providers/decorators/game-auth/game-auth.decorator";
import { SwaggerTags } from "@src/infrastructure/api/server/swagger/constants/swagger.enums";

import { MongoIdPipe } from "@shared/infrastructure/http/pipes/mongo/mongo-id/mongo-id.pipe";
import { Localization } from "@shared/infrastructure/http/decorators/localization/localization.decorator";
import { ControllerPrefixes } from "@shared/infrastructure/http/controllers/controllers.enums";

import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { createQuestionDtoFromEntity } from "@question/application/mappers/question/question.dto.mappers";
import { FindQuestionsUseCase } from "@question/application/use-cases/find-questions/find-questions.use-case";
import { QuestionDto } from "@question/application/dto/question/question.dto";

import { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";

@GameAuth()
@Controller(ControllerPrefixes.QUESTIONS)
export class QuestionController {
  public constructor(
    private readonly findQuestionsUseCase: FindQuestionsUseCase,
    private readonly findQuestionByIdUseCase: FindQuestionByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({
    tags: [SwaggerTags.QUESTIONS],
    summary: "Get all questions",
    description: "Get the list of all questions available in the database in the desired localization.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: [QuestionDto],
  })
  public async findQuestions(@Localization() localization: LocalizationOptions): Promise<QuestionDto[]> {
    const questions = await this.findQuestionsUseCase.list();

    return questions.map(question => createQuestionDtoFromEntity(question, localization));
  }

  @Get("/:id")
  @ApiOperation({
    tags: [SwaggerTags.QUESTIONS],
    summary: "Get question by ID",
    description: "Get a specific question by its unique identifier in the desired localization.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: QuestionDto,
  })
  public async findQuestionById(
    @Param("id", MongoIdPipe) id: string,
    @Localization() localization: LocalizationOptions,
  ): Promise<QuestionDto> {
    const question = await this.findQuestionByIdUseCase.getById(id);

    return createQuestionDtoFromEntity(question, localization);
  }
}