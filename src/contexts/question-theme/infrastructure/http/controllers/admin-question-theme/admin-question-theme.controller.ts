import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";

import { AdminQuestionThemeNestZodDto } from "@question-theme/application/dto/admin-question-theme/admin-question-theme.dto";
import { AdminQuestionThemeDto } from "@question-theme/application/dto/admin-question-theme/admin-question-theme.dto.shape";
import { AdminFindQuestionThemesQueryNestZodDto } from "@question-theme/application/dto/admin-find-question-themes-query/admin-find-question-themes-query.dto";
import { QuestionThemeCreationNestZodDto } from "@question-theme/application/dto/question-theme-creation/question-theme-creation.dto";
import { QuestionThemeModificationNestZodDto } from "@question-theme/application/dto/question-theme-modification/question-theme-modification.dto";
import { createAdminQuestionThemeDtoFromEntity, createQuestionThemeCreationCommandFromDto, createQuestionThemeModificationCommandFromDto } from "@question-theme/application/mappers/question-theme.mappers";
import { ArchiveQuestionThemeUseCase } from "@question-theme/application/use-cases/archive-question-theme/archive-question-theme.use-case";
import { CreateQuestionThemeUseCase } from "@question-theme/application/use-cases/create-question-theme/create-question-theme.use-case";
import { FindQuestionThemeByIdUseCase } from "@question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { FindQuestionThemesUseCase } from "@question-theme/application/use-cases/find-question-themes/find-question-themes.use-case";
import { ModifyQuestionThemeUseCase } from "@question-theme/application/use-cases/modify-question-theme/modify-question-theme.use-case";
import { createAdminQuestionThemeFilterOptionsFromQueryDto } from "@question-theme/application/mappers/question-theme-filter-query-dto/question-theme-filter-query-dto.mappers";

import { SwaggerTags } from "@src/infrastructure/api/server/swagger/constants/swagger.enums";
import { AdminAuth } from "@src/infrastructure/api/auth/providers/decorators/admin-auth/admin-auth.decorator";

import { MongoIdPipe } from "@shared/infrastructure/http/pipes/mongo/mongo-id/mongo-id.pipe";
import { ControllerPrefixes } from "@shared/infrastructure/http/controllers/controllers.enums";
import { createFindAllOptionsFromQueryDto } from "@shared/application/mappers/find-all-query-dto/find-all-query-dto.mappers";

@AdminAuth()
@Controller(`${ControllerPrefixes.ADMIN}/${ControllerPrefixes.QUESTION_THEMES}`)
export class AdminQuestionThemeController {
  public constructor(
    private readonly findQuestionThemesUseCase: FindQuestionThemesUseCase,
    private readonly findQuestionThemeByIdUseCase: FindQuestionThemeByIdUseCase,
    private readonly createQuestionThemeUseCase: CreateQuestionThemeUseCase,
    private readonly modifyQuestionThemeUseCase: ModifyQuestionThemeUseCase,
    private readonly archiveQuestionThemeUseCase: ArchiveQuestionThemeUseCase,
  ) {}

  @Get()
  @ApiOperation({
    tags: [
      SwaggerTags.ADMIN,
      SwaggerTags.QUESTION_THEMES,
    ],
    summary: "Get all question themes for backend administration",
    description: "Get the list of all question themes available in the database with detailed structure for backend administration.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: [AdminQuestionThemeNestZodDto],
  })
  public async findQuestionThemes(@Query() queryDto: AdminFindQuestionThemesQueryNestZodDto): Promise<AdminQuestionThemeDto[]> {
    const findAllOptions = createFindAllOptionsFromQueryDto(queryDto, createAdminQuestionThemeFilterOptionsFromQueryDto);
    const questionThemes = await this.findQuestionThemesUseCase.list(findAllOptions);

    return questionThemes.map(questionTheme => createAdminQuestionThemeDtoFromEntity(questionTheme));
  }

  @Get("/:id")
  @ApiOperation({
    tags: [
      SwaggerTags.ADMIN,
      SwaggerTags.QUESTION_THEMES,
    ],
    summary: "Get question theme by ID for backend administration",
    description: "Get a specific question theme by its unique identifier with detailed structure for backend administration.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: AdminQuestionThemeNestZodDto,
  })
  public async findQuestionThemeById(@Param("id", MongoIdPipe) id: string): Promise<AdminQuestionThemeDto> {
    const questionTheme = await this.findQuestionThemeByIdUseCase.getById(id);

    return createAdminQuestionThemeDtoFromEntity(questionTheme);
  }

  @Post()
  @ApiOperation({
    tags: [
      SwaggerTags.ADMIN,
      SwaggerTags.QUESTION_THEMES,
    ],
    summary: "Create a new question theme",
    description: "Create a new question theme with the provided details. Returns the created question theme with detailed structure for backend administration.",
  })
  @ZodResponse({
    status: HttpStatus.CREATED,
    type: AdminQuestionThemeNestZodDto,
  })
  public async createQuestionTheme(@Body() questionThemeCreationDto: QuestionThemeCreationNestZodDto): Promise<AdminQuestionThemeDto> {
    const questionThemeCreationCommand = createQuestionThemeCreationCommandFromDto(questionThemeCreationDto);
    const createdQuestionTheme = await this.createQuestionThemeUseCase.create(questionThemeCreationCommand);

    return createAdminQuestionThemeDtoFromEntity(createdQuestionTheme);
  }

  @Patch("/:id")
  @ApiOperation({
    tags: [
      SwaggerTags.ADMIN,
      SwaggerTags.QUESTION_THEMES,
    ],
    summary: "Update an existing question theme",
    description: "Update an existing question theme with the provided details. Returns the updated question theme with detailed structure for backend administration.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: AdminQuestionThemeNestZodDto,
  })
  public async patchQuestionTheme(
    @Param("id", MongoIdPipe) id: string,
    @Body() questionThemeModificationDto: QuestionThemeModificationNestZodDto,
  ): Promise<AdminQuestionThemeDto> {
    const questionThemeModificationCommand = createQuestionThemeModificationCommandFromDto(id, questionThemeModificationDto);
    const modifiedQuestionTheme = await this.modifyQuestionThemeUseCase.modify(questionThemeModificationCommand);

    return createAdminQuestionThemeDtoFromEntity(modifiedQuestionTheme);
  }

  @Post("/:id/archive")
  @ApiOperation({
    tags: [
      SwaggerTags.ADMIN,
      SwaggerTags.QUESTION_THEMES,
    ],
    summary: "Archive a question theme",
    description: `Archive a specific question theme by its unique identifier. Returns the archived question theme with detailed structure for backend administration. An already archived question theme cannot be archived again.`,
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: AdminQuestionThemeNestZodDto,
  })
  public async archiveQuestionTheme(@Param("id", MongoIdPipe) id: string): Promise<AdminQuestionThemeDto> {
    const archivedQuestionTheme = await this.archiveQuestionThemeUseCase.archive(id);

    return createAdminQuestionThemeDtoFromEntity(archivedQuestionTheme);
  }
}