import { Inject, Injectable } from "@nestjs/common";

import { FindQuestionThemeByIdUseCase } from "@question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { ReferencedQuestionThemeArchivedError } from "@question-theme/domain/errors/referenced-question-theme-archived/referenced-question-theme-archived.error";
import { isQuestionThemeArchived } from "@question-theme/domain/rules/question-theme.rules";

import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { QuestionThemeAssignmentCreationCommand } from "@question/domain/types/question.commands";
import { QuestionThemeAssignmentCreationContract } from "@question/domain/types/question.contracts";
import { QuestionThemeAssignmentAlreadyExistsError } from "@question/domain/errors/question-theme-assignment-already-exists/question-theme-assignment-already-exists.error";
import { QuestionThemeAssignmentCreationError } from "@question/domain/errors/question-theme-assignment-creation/question-theme-assignment-creation.error";
import { findQuestionThemeAssignmentInQuestionByThemeId } from "@question/domain/rules/question.rules";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { Question } from "@question/domain/types/question.entities";

import { QuestionRepository } from "@question/domain/repositories/question.repository.types";

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