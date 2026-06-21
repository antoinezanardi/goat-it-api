import { Inject, Injectable } from "@nestjs/common";

import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { QuestionThemeAssignmentRemovalCommand } from "@question/domain/types/question.commands";
import { QuestionThemeAssignmentRemovalError } from "@question/domain/errors/question-theme-assignment-removal/question-theme-assignment-removal.error";
import { QuestionMinimumThemesError } from "@question/domain/errors/question-minimum-themes/question-minimum-themes.error";
import { ensureQuestionThemeAssignmentIsRemovable } from "@question/domain/rules/question.rules";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS } from "@question/domain/constants/question.constants";
import { Question } from "@question/domain/types/question.entities";

import { QuestionRepository } from "@question/domain/repositories/question.repository.types";

@Injectable()
export class RemoveThemeFromQuestionUseCase {
  public constructor(
    @Inject(QUESTION_REPOSITORY_TOKEN) private readonly questionRepository: QuestionRepository,
    private readonly findQuestionByIdUseCase: FindQuestionByIdUseCase,
  ) {}

  public async remove(questionAssignmentRemovalCommand: QuestionThemeAssignmentRemovalCommand): Promise<Question> {
    const { questionId, themeId } = questionAssignmentRemovalCommand;
    await this.throwIfThemeNotRemovableFromQuestion(questionId, themeId);
    const updatedQuestion = await this.questionRepository.removeTheme(questionId, themeId);
    if (!updatedQuestion) {
      throw new QuestionThemeAssignmentRemovalError(themeId, questionId);
    }
    return updatedQuestion;
  }

  private async throwIfThemeNotRemovableFromQuestion(questionId: string, themeId: string): Promise<void> {
    const question = await this.findQuestionByIdUseCase.getById(questionId);
    ensureQuestionThemeAssignmentIsRemovable(question, themeId);

    if (question.themes.length <= QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS) {
      throw new QuestionMinimumThemesError(questionId);
    }
  }
}