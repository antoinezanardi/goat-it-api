import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ZodResponse } from "nestjs-zod";

import { ControllerPrefixes } from "@shared/infrastructure/http/controllers/controllers.enums";

import { createQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme.dto.mappers";
import { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme.dto";
import { FindAllQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-all-question-themes/find-all-question-themes.use-case";

@Controller(ControllerPrefixes.QUESTION_THEMES)
export class QuestionThemeController {
  public constructor(private readonly findAllQuestionThemesUseCase: FindAllQuestionThemesUseCase) {}

  @Get()
  @ZodResponse({
    status: HttpStatus.OK,
    type: [QuestionThemeDto],
  })
  public async findAllQuestionThemes(): Promise<QuestionThemeDto[]> {
    const questionThemes = await this.findAllQuestionThemesUseCase.list();

    return questionThemes.map(createQuestionThemeDtoFromEntity);
  }
}