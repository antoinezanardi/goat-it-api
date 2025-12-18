import { Controller, Get, HttpStatus, Param } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";

import { SwaggerTags } from "@src/infrastructure/api/server/swagger/constants/swagger.enums";

import { ControllerPrefixes } from "@shared/infrastructure/http/controllers/controllers.enums";
import { MongoIdPipe } from "@shared/infrastructure/http/pipes/mongo/mongo-id/mongo-id.pipe";

import { AdminQuestionThemeDto } from "@question/modules/question-theme/application/dto/admin-question-theme/admin-question-theme.dto";
import { createAdminQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme/question-theme.dto.mappers";
import { FindAllQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-all-question-themes/find-all-question-themes.use-case";
import { FindQuestionThemeByIdUseCase } from "@question/modules/question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";

@Controller(`${ControllerPrefixes.ADMIN}/${ControllerPrefixes.QUESTION_THEMES}`)
export class AdminQuestionThemeController {
  public constructor(
    private readonly findAllQuestionThemesUseCase: FindAllQuestionThemesUseCase,
    private readonly findQuestionThemeByIdUseCase: FindQuestionThemeByIdUseCase,
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
    type: [AdminQuestionThemeDto],
  })
  public async findAllQuestionThemes(): Promise<AdminQuestionThemeDto[]> {
    const questionThemes = await this.findAllQuestionThemesUseCase.list();

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
    type: AdminQuestionThemeDto,
  })
  public async findQuestionThemeById(@Param("id", MongoIdPipe) id: string): Promise<AdminQuestionThemeDto> {
    const questionTheme = await this.findQuestionThemeByIdUseCase.getById(id);

    return createAdminQuestionThemeDtoFromEntity(questionTheme);
  }
}