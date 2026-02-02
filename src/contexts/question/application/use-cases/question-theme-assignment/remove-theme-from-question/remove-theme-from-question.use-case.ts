import { Inject, Injectable } from "@nestjs/common";

import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { QuestionThemeAssignmentRemovalCommand } from "@question/domain/commands/question-theme-assignment/question-theme-assignment.commands";
import { QuestionThemeAssignmentAbsentError, QuestionThemeAssignmentRemovalError } from "@question/domain/errors/question-theme-assignment/question-theme-assignment.errors";
import { QuestionMinimumThemesError } from "@question/domain/errors/question.errors";
import { findQuestionThemeAssignmentInQuestionByThemeId } from "@question/domain/helpers/question-theme-assignment/question-theme-assignment.helpers";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.constants";

import { Question } from "@question/domain/entities/question.types";
import { QuestionRepository } from "@question/domain/repositories/question.repository.types";

@Injectable()
export class RemoveThemeFromQuestionUseCase {
  public constructor(
    @Inject(QUESTION_REPOSITORY_TOKEN) private readonly questionRepository: QuestionRepository,
    private readonly findQuestionByIdUseCase: FindQuestionByIdUseCase,
  ) {}

  public async remove(questionAssignmentRemovalCommand: QuestionThemeAssignmentRemovalCommand): Promise<Question> {
    const { questionId, themeId } = questionAssignmentRemovalCommand;
    await this.checkThemeIsRemovableFromQuestion(questionId, themeId);
    const updatedQuestion = await this.questionRepository.removeTheme(questionId, themeId);
    if (!updatedQuestion) {
      throw new QuestionThemeAssignmentRemovalError(themeId, questionId);
    }
    return updatedQuestion;
  }

  private async checkThemeIsRemovableFromQuestion(questionId: string, themeId: string): Promise<void> {
    const question = await this.findQuestionByIdUseCase.getById(questionId);
    if (!findQuestionThemeAssignmentInQuestionByThemeId(question, themeId)) {
      throw new QuestionThemeAssignmentAbsentError(themeId, questionId);
    }

    if (question.themes.length <= QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS) {
      throw new QuestionMinimumThemesError(questionId);
    }
  }
}