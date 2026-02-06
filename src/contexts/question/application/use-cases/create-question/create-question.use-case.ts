import { Inject, Injectable } from "@nestjs/common";

import { QuestionCreationCommand } from "@question/domain/commands/question.commands";
import { QuestionCreationError } from "@question/domain/errors/question.errors";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { GetQuestionThemesByIdsOrThrowUseCase } from "@question/modules/question-theme/application/use-cases/get-question-themes-by-ids-or-throw/get-question-themes-by-ids-or-throw.use-case";
import { ReferencedQuestionThemeArchivedError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { findArchivedQuestionTheme } from "@question/modules/question-theme/domain/helpers/question-theme-status/question-theme-status.helpers";

import { Question } from "@question/domain/entities/question.types";
import { QuestionRepository } from "@question/domain/repositories/question.repository.types";

@Injectable()
export class CreateQuestionUseCase {
  public constructor(
    @Inject(QUESTION_REPOSITORY_TOKEN) private readonly questionRepository: QuestionRepository,
    private readonly getQuestionThemesByIdsOrThrowUseCase: GetQuestionThemesByIdsOrThrowUseCase,
  ) {}

  public async create(questionCreateCommand: QuestionCreationCommand): Promise<Question> {
    await this.throwIfQuestionNotCreatable(questionCreateCommand);
    const question = await this.questionRepository.create(questionCreateCommand.payload);
    if (!question) {
      throw new QuestionCreationError();
    }
    return question;
  }

  private async throwIfQuestionNotCreatable(questionCreateCommand: QuestionCreationCommand): Promise<void> {
    const themeIds = new Set(questionCreateCommand.payload.themes.map(themeAssignment => themeAssignment.themeId));

    const questionThemes = await this.getQuestionThemesByIdsOrThrowUseCase.getByIdsOrThrow(themeIds);
    const archivedQuestionTheme = findArchivedQuestionTheme(questionThemes);
    if (archivedQuestionTheme) {
      throw new ReferencedQuestionThemeArchivedError(archivedQuestionTheme.id);
    }
  }
}