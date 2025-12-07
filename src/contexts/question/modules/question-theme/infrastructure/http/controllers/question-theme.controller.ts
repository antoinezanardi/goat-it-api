import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { ZodResponse } from "nestjs-zod";

import { ControllerPrefixes } from "@shared/infrastructure/http/controllers/controllers.enums";
import { Localization } from "@shared/infrastructure/http/decorators/localization/localization.decorator";
import { MongoIdPipe } from "@shared/infrastructure/http/pipes/mongo/mongo-id/mongo-id.pipe";

import { CreateQuestionThemeDto } from "@question/modules/question-theme/application/dto/create-question-theme.dto";
import { ArchiveQuestionThemeUseCase } from "@question/modules/question-theme/application/use-cases/archive-question-theme/archive-question-theme.use-case";
import { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme.dto";
import { createQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme.dto.mappers";
import { FindAllQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-all-question-themes/find-all-question-themes.use-case";
import { FindQuestionThemeByIdUseCase } from "@question/modules/question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";

import { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";

@Controller(ControllerPrefixes.QUESTION_THEMES)
export class QuestionThemeController {
  public constructor(
    private readonly findAllQuestionThemesUseCase: FindAllQuestionThemesUseCase,
    private readonly findQuestionThemeByIdUseCase: FindQuestionThemeByIdUseCase,
    private readonly archiveQuestionThemeUseCase: ArchiveQuestionThemeUseCase,
  ) {}

  @Get()
  @ZodResponse({
    status: HttpStatus.OK,
    type: [QuestionThemeDto],
  })
  public async findAllQuestionThemes(@Localization() localization: LocalizationOptions): Promise<QuestionThemeDto[]> {
    const questionThemes = await this.findAllQuestionThemesUseCase.list();

    return questionThemes.map(questionTheme => createQuestionThemeDtoFromEntity(questionTheme, localization));
  }

  @Get("/:id")
  @ZodResponse({
    status: HttpStatus.OK,
    type: QuestionThemeDto,
  })
  public async findQuestionThemeById(
    @Param("id", MongoIdPipe) id: string,
    @Localization() localization: LocalizationOptions,
  ): Promise<QuestionThemeDto> {
    const questionTheme = await this.findQuestionThemeByIdUseCase.getById(id);

    return createQuestionThemeDtoFromEntity(questionTheme, localization);
  }

  @Post()
  @ZodResponse({
    status: HttpStatus.OK,
    type: QuestionThemeDto,
  })
  public async createQuestionTheme(
    @Body() createQuestionThemeDto: CreateQuestionThemeDto,
    @Localization() localization: LocalizationOptions,
  ): Promise<QuestionThemeDto> {
    console.log(createQuestionThemeDto);
  }

  @Post("/:id/archive")
  @ZodResponse({
    status: HttpStatus.OK,
    type: QuestionThemeDto,
  })
  public async archiveQuestionTheme(
    @Param("id", MongoIdPipe) id: string,
    @Localization() localization: LocalizationOptions,
  ): Promise<QuestionThemeDto> {
    const archivedQuestionTheme = await this.archiveQuestionThemeUseCase.archive(id);

    return createQuestionThemeDtoFromEntity(archivedQuestionTheme, localization);
  }
}