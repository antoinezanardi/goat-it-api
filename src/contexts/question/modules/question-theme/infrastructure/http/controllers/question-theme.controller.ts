import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ZodResponse } from "nestjs-zod";

import { Localization } from "@shared/infrastructure/http/decorators/localization/localization.decorator";
import { ControllerPrefixes } from "@shared/infrastructure/http/controllers/controllers.enums";

import { createQuestionThemeDtoFromEntity } from "@question/modules/question-theme/application/mappers/question-theme.dto.mappers";
import { QuestionThemeDto } from "@question/modules/question-theme/application/dto/question-theme.dto";
import { FindAllQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-all-question-themes/find-all-question-themes.use-case";

import { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";

@Controller(ControllerPrefixes.QUESTION_THEMES)
export class QuestionThemeController {
  public constructor(private readonly findAllQuestionThemesUseCase: FindAllQuestionThemesUseCase) {}

  @Get()
  @ZodResponse({
    status: HttpStatus.OK,
    type: [QuestionThemeDto],
  })
  public async findAllQuestionThemes(@Localization() localization: LocalizationOptions): Promise<QuestionThemeDto[]> {
    const questionThemes = await this.findAllQuestionThemesUseCase.list();

    return questionThemes.map(questionTheme => createQuestionThemeDtoFromEntity(questionTheme, localization));
  }
}