import { Inject, Injectable } from "@nestjs/common";

import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { QuestionThemeAssignmentCreationCommand } from "@question/domain/commands/question-theme-assignment/question-theme-assignment.commands";
import { QuestionThemeAssignmentCreationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment.contracts";
import { QuestionThemeAssignmentAlreadyExistsError, QuestionThemeAssignmentCreationError } from "@question/domain/errors/question-theme-assignment/question-theme-assignment.errors";
import { findQuestionThemeAssignmentInQuestionByThemeId } from "@question/domain/helpers/question-theme-assignment/question-theme-assignment.helpers";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { FindQuestionThemeByIdUseCase } from "@question/modules/question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { ReferencedQuestionThemeArchivedError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { isQuestionThemeArchived } from "@question/modules/question-theme/domain/predicates/question-theme-status/question-theme-status.predicates";

import { QuestionRepository } from "@question/domain/repositories/question.repository.types";
import { Question } from "@question/domain/entities/question.types";

@Injectable()
export class AssignThemeToQuestionUseCase {
  public constructor(
    @Inject(QUESTION_REPOSITORY_TOKEN) private readonly questionRepository: QuestionRepository,
    private readonly findQuestionThemeByIdUseCase: FindQuestionThemeByIdUseCase,
    private readonly findQuestionByIdUseCase: FindQuestionByIdUseCase,
  ) {}

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
    if (isQuestionThemeArchived(questionTheme)) {
      throw new ReferencedQuestionThemeArchivedError(questionTheme.id);
    }
  }
}