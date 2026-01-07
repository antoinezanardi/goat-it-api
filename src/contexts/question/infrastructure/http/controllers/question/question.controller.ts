import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";

import { GameAuth } from "@src/infrastructure/api/auth/providers/decorators/game-auth/game-auth.decorator";
import { SwaggerTags } from "@src/infrastructure/api/server/swagger/constants/swagger.enums";

import { Localization } from "@shared/infrastructure/http/decorators/localization/localization.decorator";
import { ControllerPrefixes } from "@shared/infrastructure/http/controllers/controllers.enums";

import { QuestionDto } from "@question/application/dto/question/question.dto";

import { LocalizationOptions } from "@shared/domain/value-objects/locale/locale.types";

@GameAuth()
@Controller(ControllerPrefixes.QUESTIONS)
export class QuestionController {
  @Get()
  @ApiOperation({
    tags: [SwaggerTags.QUESTIONS],
    summary: "Get all question",
    description: "Get the list of all questions available in the database in the desired localization.",
  })
  @ZodResponse({
    status: HttpStatus.OK,
    type: [QuestionDto],
  })
  public async findAllQuestions(@Localization() localization: LocalizationOptions): Promise<QuestionDto[]> {
    // TODO: Implement the logic to fetch and return all questions
    return [];
  }
}