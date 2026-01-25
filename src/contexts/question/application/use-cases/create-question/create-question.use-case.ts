import { Inject, Injectable } from "@nestjs/common";

import { QuestionCreationCommand } from "@question/domain/commands/question.commands";
import { QuestionCreationError } from "@question/domain/errors/question.errors";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { CheckQuestionThemesExistenceUseCase } from "@question/modules/question-theme/application/use-cases/check-question-themes-existence/check-question-themes-existence.use-case";

import { Question } from "@question/domain/entities/question.types";
import { QuestionRepository } from "@question/domain/repositories/question.repository.types";

@Injectable()
export class CreateQuestionUseCase {
  public constructor(
    @Inject(QUESTION_REPOSITORY_TOKEN) private readonly questionRepository: QuestionRepository,
    private readonly checkQuestionThemesExistenceUseCase: CheckQuestionThemesExistenceUseCase,
  ) {}

  public async create(questionCreateCommand: QuestionCreationCommand): Promise<Question> {
    await this.checkQuestionIsCreatable(questionCreateCommand);
    const question = await this.questionRepository.create(questionCreateCommand.payload);
    if (!question) {
      throw new QuestionCreationError();
    }
    return question;
  }

  private async checkQuestionIsCreatable(questionCreateCommand: QuestionCreationCommand): Promise<void> {
    const themeIds = new Set(questionCreateCommand.payload.themes.map(themeAssignment => themeAssignment.themeId));

    await this.checkQuestionThemesExistenceUseCase.checkExistenceByIds(themeIds);
  }
}