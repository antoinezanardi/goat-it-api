import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import type { QuestionThemeAssignmentRemovalCommand } from "@question/application/commands/question.commands";
import { QuestionThemeAssignmentRemovalError } from "@question/domain/errors/question-theme-assignment-removal/question-theme-assignment-removal.error";
import { QuestionMinimumThemesError } from "@question/domain/errors/question-minimum-themes/question-minimum-themes.error";
import { ensureQuestionThemeAssignmentIsRemovable } from "@question/domain/rules/question.rules";
import { QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS } from "@question/domain/constants/question.constants";
import type { Question } from "@question/domain/types/question.entities";

import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

/**
 * Removes a theme from a question after checking that the assignment exists, is not the primary one and that a theme remains.
 */
export class RemoveThemeFromQuestionUseCase {
  public constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly findQuestionByIdUseCase: FindQuestionByIdUseCase,
  ) {}

  /**
   * Returns the question without the removed assignment.
   *
   * @throws `QuestionNotFoundError` when no question matches the question id.
   * @throws `QuestionThemeAssignmentAbsentError` when the question has no assignment for the theme id.
   * @throws `QuestionPrimaryThemeAssignmentNotRemovableError` when the assignment is the primary one.
   * @throws `QuestionMinimumThemesError` when removing the assignment would leave the question below the minimum number of themes.
   * @throws `QuestionThemeAssignmentRemovalError` when the question is written but cannot be read back.
   */
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