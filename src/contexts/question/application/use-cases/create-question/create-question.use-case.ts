import { Inject, Injectable } from "@nestjs/common";

import { QuestionCreationCommand } from "@question/domain/commands/question.commands";
import { QuestionCreationError } from "@question/domain/errors/question.errors";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { FindAllQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-all-question-themes/find-all-question-themes.use-case";

import { Question } from "@question/domain/entities/question.types";
import { QuestionRepository } from "@question/domain/repositories/question.repository.types";

@Injectable()
export class CreateQuestionUseCase {
  public constructor(
    @Inject(QUESTION_REPOSITORY_TOKEN) private readonly questionRepository: QuestionRepository,
    private readonly findAllQuestionThemesUseCase: FindAllQuestionThemesUseCase,
  ) {}

  public async checkQuestionIsCreatable(questionCreateCommand: QuestionCreationCommand): Promise<void> {
    const themeIds = new Set(questionCreateCommand.payload.themes.map(themeAssignment => themeAssignment.themeId));

    await this.findAllQuestionThemesUseCase.checkExistenceByIds(themeIds);
  }

  public async create(questionCreateCommand: QuestionCreationCommand): Promise<Question> {
    await this.checkQuestionIsCreatable(questionCreateCommand);
    const question = await this.questionRepository.create(questionCreateCommand.payload);
    if (!question) {
      throw new QuestionCreationError();
    }
    return question;
  }
}