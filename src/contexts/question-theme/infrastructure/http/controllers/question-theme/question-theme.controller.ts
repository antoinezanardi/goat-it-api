import { Controller, Get, HttpStatus, Param, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";

import { QuestionThemeNestZodDto } from "@question-theme/infrastructure/http/dto/question-theme/question-theme.dto";
import { createQuestionThemeDtoFromEntity } from "@question-theme/contracts/dto/question-theme.dto.mappers";
import { FindQuestionThemeByIdUseCase } from "@question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { FindQuestionThemesUseCase } from "@question-theme/application/use-cases/find-question-themes/find-question-themes.use-case";
import { FindQuestionThemesQueryNestZodDto } from "@question-theme/infrastructure/http/dto/find-question-themes-query/find-question-themes-query.dto";
import { QUESTION_THEME_ROUTE_PREFIX } from "@question-theme/infrastructure/http/controllers/question-theme/question-theme.constants";

import { GameAuth } from "@src/infrastructure/api/auth/providers/decorators/game-auth/game-auth.decorator";
import { SWAGGER_TAGS } from "@src/infrastructure/api/server/swagger/constants/swagger.constants";

import { createSortOptionsFromSortQueryDto } from "@shared/application/mappers/sort-query-dto/sort-query-dto.mappers";
import { Localization } from "@shared/infrastructure/http/decorators/localization/localization.decorator";
import { MongoIdPipe } from "@shared/infrastructure/http/pipes/mongo/mongo-id/mongo-id.pipe";

import type { QuestionThemeDto } from "@question-theme/contracts/dto/question-theme/question-theme.dto.shape";

import type { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";

@GameAuth()
@Controller(QUESTION_THEME_ROUTE_PREFIX)
export class QuestionThemeController {
  public constructor(
    private readonly findQuestionThemesUseCase: FindQuestionThemesUseCase,
    private readonly findQuestionThemeByIdUseCase: FindQuestionThemeByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({
    tags: [SWAGGER_TAGS.QUESTION_THEMES],
    summary: "Get all question themes",
    description: "Get the list of all question themes available in the database in the desired localization.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: [QuestionThemeNestZodDto],
  })
  public async findQuestionThemes(
    @Query() queryDto: FindQuestionThemesQueryNestZodDto,
    @Localization() localization: LocalizationOptions,
  ): Promise<QuestionThemeDto[]> {
    const sortOptions = createSortOptionsFromSortQueryDto(queryDto);
    const questionThemes = await this.findQuestionThemesUseCase.list({ sort: sortOptions, limit: queryDto.limit });

    return questionThemes.map(questionTheme => createQuestionThemeDtoFromEntity(questionTheme, localization));
  }

  @Get("/:id")
  @ApiOperation({
    tags: [SWAGGER_TAGS.QUESTION_THEMES],
    summary: "Get question theme by ID",
    description: "Get a specific question theme by its unique identifier in the desired localization.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: QuestionThemeNestZodDto,
  })
  public async findQuestionThemeById(
    @Param("id", MongoIdPipe) id: string,
    @Localization() localization: LocalizationOptions,
  ): Promise<QuestionThemeDto> {
    const questionTheme = await this.findQuestionThemeByIdUseCase.getById(id);

    return createQuestionThemeDtoFromEntity(questionTheme, localization);
  }
}