import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { QuestionThemeAssignmentModificationError } from "@question/domain/errors/question-theme-assignment-modification/question-theme-assignment-modification.error";
import { ensureQuestionThemeAssignmentIsModifiable } from "@question/domain/rules/question.rules";

import type { QuestionThemeAssignmentModificationCommand } from "@question/application/commands/question.commands";
import type { Question } from "@question/domain/types/question.entities";
import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

/**
 * Modifies an existing theme assignment on a question, for example to promote it to primary or toggle its hint flag.
 */
export class ModifyQuestionThemeAssignmentUseCase {
  public constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly findQuestionByIdUseCase: FindQuestionByIdUseCase,
  ) {}

  /**
   * Returns the question with the modified assignment.
   *
   * A conditional write that matches no document is re-evaluated against the stored question to surface the invariant that blocked it, falling back to the write error.
   *
   * @throws `QuestionNotFoundError` when no question matches the question id.
   * @throws `QuestionThemeAssignmentAbsentError` when the question has no assignment for the theme id.
   * @throws `QuestionThemeAssignmentModificationError` when the question is written but cannot be read back.
   */
  public async modify(command: QuestionThemeAssignmentModificationCommand): Promise<Question> {
    const { questionId, themeId, payload } = command;
    await this.throwIfThemeAssignmentNotModifiable(questionId, themeId);
    const updatedQuestion = await this.questionRepository.modifyThemeAssignment(questionId, themeId, payload);
    if (!updatedQuestion) {
      return this.throwErrorForQuestionThemeAssignmentModificationNoMatch(questionId, themeId);
    }
    return updatedQuestion;
  }

  private async throwErrorForQuestionThemeAssignmentModificationNoMatch(questionId: string, themeId: string): Promise<never> {
    await this.throwIfThemeAssignmentNotModifiable(questionId, themeId);
    throw new QuestionThemeAssignmentModificationError(themeId, questionId);
  }

  private async throwIfThemeAssignmentNotModifiable(questionId: string, themeId: string): Promise<void> {
    const question = await this.findQuestionByIdUseCase.getById(questionId);
    ensureQuestionThemeAssignmentIsModifiable(question, themeId);
  }
}