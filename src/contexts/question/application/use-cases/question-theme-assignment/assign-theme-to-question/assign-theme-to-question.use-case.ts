import { isQuestionThemeArchived } from "@question-theme/domain/rules/question-theme.rules";
import { FindQuestionThemeByIdUseCase } from "@question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";

import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import type { QuestionThemeAssignmentCreationCommand } from "@question/application/commands/question.commands";
import { QuestionThemeAssignmentAlreadyExistsError } from "@question/domain/errors/question-theme-assignment-already-exists/question-theme-assignment-already-exists.error";
import { QuestionThemeAssignmentCreationError } from "@question/domain/errors/question-theme-assignment-creation/question-theme-assignment-creation.error";
import { ensureQuestionThemeAssignmentsLimit, findQuestionThemeAssignmentInQuestionByThemeId } from "@question/domain/rules/question.rules";
import type { Question } from "@question/domain/types/question.entities";
import { ReferencedQuestionThemeArchivedError } from "@question/domain/errors/referenced-question-theme-archived/referenced-question-theme-archived.error";

import type { QuestionThemeAssignmentCreationContract } from "@question/domain/repositories/question.repository-contracts.types";
import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

/**
 * Assigns one theme to a question after checking that both exist, that the assignment is not a duplicate, that the question has room and that the theme is not archived.
 */
export class AssignThemeToQuestionUseCase {
  public constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly findQuestionThemeByIdUseCase: FindQuestionThemeByIdUseCase,
    private readonly findQuestionByIdUseCase: FindQuestionByIdUseCase,
  ) {}

  /**
   * Returns the question with the new theme assignment.
   *
   * @throws `QuestionNotFoundError` when no question matches the question id.
   * @throws `QuestionThemeNotFoundError` when no theme matches the assignment theme id.
   * @throws `QuestionThemeAssignmentAlreadyExistsError` when the theme is already assigned to the question.
   * @throws `QuestionMaximumThemesError` when the question already holds the maximum number of theme assignments.
   * @throws `ReferencedQuestionThemeArchivedError` when the theme is archived.
   * @throws `QuestionThemeAssignmentCreationError` when the question is written but cannot be read back.
   */
  public async assign(questionThemeAssignmentCreationCommand: QuestionThemeAssignmentCreationCommand): Promise<Question> {
    const { questionId, payload: questionThemeAssignmentPayload } = questionThemeAssignmentCreationCommand;
    await this.throwIfThemeNotAssignableToQuestion(questionThemeAssignmentPayload, questionId);
    const updatedQuestion = await this.questionRepository.assignTheme(questionId, questionThemeAssignmentPayload);
    if (!updatedQuestion) {
      throw new QuestionThemeAssignmentCreationError(questionThemeAssignmentPayload.themeId, questionId);
    }
    return updatedQuestion;
  }

  private async throwIfThemeNotAssignableToQuestion(questionThemeAssignmentContract: QuestionThemeAssignmentCreationContract, questionId: string): Promise<void> {
    const question = await this.findQuestionByIdUseCase.getById(questionId);
    const questionTheme = await this.findQuestionThemeByIdUseCase.getById(questionThemeAssignmentContract.themeId);

    const existingThemeAssignment = findQuestionThemeAssignmentInQuestionByThemeId(question, questionTheme.id);
    if (existingThemeAssignment) {
      throw new QuestionThemeAssignmentAlreadyExistsError(questionTheme.id, questionId);
    }
    ensureQuestionThemeAssignmentsLimit(question);
    if (isQuestionThemeArchived(questionTheme)) {
      throw new ReferencedQuestionThemeArchivedError(questionTheme.id);
    }
  }
}