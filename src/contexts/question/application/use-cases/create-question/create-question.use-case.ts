import { ReferencedQuestionThemeArchivedError } from "@question-theme/domain/errors/referenced-question-theme-archived/referenced-question-theme-archived.error";
import { findArchivedQuestionTheme } from "@question-theme/domain/rules/question-theme.rules";
import { GetQuestionThemesByIdsOrThrowUseCase } from "@question-theme/application/use-cases/get-question-themes-by-ids-or-throw/get-question-themes-by-ids-or-throw.use-case";

import type { QuestionCreationCommand } from "@question/application/commands/question.commands";
import { QuestionCreationError } from "@question/domain/errors/question-creation/question-creation.error";
import type { Question } from "@question/domain/types/question.entities";

import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

export class CreateQuestionUseCase {
  public constructor(
    private readonly questionRepository: QuestionRepository,
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