import { Controller, Get, HttpStatus, Param, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";

import { GameAuth } from "@src/infrastructure/api/auth/providers/decorators/game-auth/game-auth.decorator";
import { SwaggerTags } from "@src/infrastructure/api/server/swagger/constants/swagger.enums";

import { createFindAllOptionsFromQueryDto } from "@shared/application/mappers/find-all-query-dto/find-all-query-dto.mappers";
import { MongoIdPipe } from "@shared/infrastructure/http/pipes/mongo/mongo-id/mongo-id.pipe";
import { Localization } from "@shared/infrastructure/http/decorators/localization/localization.decorator";
import { ControllerPrefixes } from "@shared/infrastructure/http/controllers/controllers.enums";

import { createPublicQuestionFilterOptionsFromQueryDto } from "@question/application/mappers/question-filter-query-dto/question-filter-query-dto.mappers";
import { FindRandomQuestionsQueryNestZodDto } from "@question/application/dto/find-random-questions-query/find-random-questions-query.dto";
import { FindQuestionsQueryNestZodDto } from "@question/application/dto/find-questions-query/find-questions-query.dto";
import { QuestionDto } from "@question/application/dto/question/question.dto.shape";
import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { FindRandomQuestionsUseCase } from "@question/application/use-cases/find-random-questions/find-random-questions.use-case";
import { createFindRandomOptionsFromQueryDto } from "@question/application/mappers/find-random-options/find-random-options.mappers";
import { createQuestionDtoFromEntity } from "@question/application/mappers/question.mappers";
import { FindQuestionsUseCase } from "@question/application/use-cases/find-questions/find-questions.use-case";
import { QuestionNestZodDto } from "@question/application/dto/question/question.dto";

import { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";

@GameAuth()
@Controller(ControllerPrefixes.QUESTIONS)
export class QuestionController {
  public constructor(
    private readonly findQuestionsUseCase: FindQuestionsUseCase,
    private readonly findRandomQuestionsUseCase: FindRandomQuestionsUseCase,
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
    type: [QuestionNestZodDto],
  })
  public async findQuestions(
    @Query() queryDto: FindQuestionsQueryNestZodDto,
    @Localization() localization: LocalizationOptions,
  ): Promise<QuestionDto[]> {
    const findAllOptions = createFindAllOptionsFromQueryDto(queryDto, createPublicQuestionFilterOptionsFromQueryDto);
    const questions = await this.findQuestionsUseCase.list(findAllOptions);

    return questions.map(question => createQuestionDtoFromEntity(question, localization));
  }

  @Get("/random")
  @ApiOperation({
    tags: [SwaggerTags.QUESTIONS],
    summary: "Get random questions",
    description: "Get a random set of active questions for the game in the desired localization.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: [QuestionNestZodDto],
  })
  public async findRandomQuestions(
    @Query() queryDto: FindRandomQuestionsQueryNestZodDto,
    @Localization() localization: LocalizationOptions,
  ): Promise<QuestionDto[]> {
    const findRandomOptions = createFindRandomOptionsFromQueryDto(queryDto);
    const questions = await this.findRandomQuestionsUseCase.list(findRandomOptions);

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
    type: QuestionNestZodDto,
  })
  public async findQuestionById(
    @Param("id", MongoIdPipe) id: string,
    @Localization() localization: LocalizationOptions,
  ): Promise<QuestionDto> {
    const question = await this.findQuestionByIdUseCase.getById(id);

    return createQuestionDtoFromEntity(question, localization);
  }
}